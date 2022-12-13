import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';
import { OrderDetailsService } from '../order-details/order-details.service';
import {
  IComputeCheckout,
  IProductDictionary,
  OrderState,
} from '@mamimomo/mamimomo-core';
import { Order } from './entities/order.entity';
import {
  Crud,
  CrudAuth,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
import { PdfService } from '../service/pdf.service';
import { StoreService } from '../store/store.service';
import { MangopayService } from '../mangopay/mangopay.service';

@Controller('orders')
@Crud({
  model: {
    type: Order,
  },
  routes: {
    only: ['getManyBase', 'updateOneBase'],
  },
  query: {
    join: {
      customer: {},
      orderDetails: {},
      'orderDetails.product': {},
    },
  },
  params: {
    id: {
      type: 'uuid',
      primary: true,
      field: 'id',
    },
  },
})
@CrudAuth({
  property: 'user',
  filter: (user) => ({
    sellerId: user.id,
  }),
})
export class OrdersController implements CrudController<Order> {
  constructor(
    readonly service: OrdersService,
    private readonly productsService: ProductsService,
    private readonly orderDetailsService: OrderDetailsService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly pdfService: PdfService,
    private readonly storeService: StoreService,
    private readonly mangoPayService: MangopayService,
  ) {}

  @Post()
  async create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    // First of all, getting all db and vars entities needed
    const [userDb, storeDb] = await Promise.all([
      this.userService.findOne(req.user.id),
      this.storeService.getStoreWithProducerAndProducts(
        createOrderDto.storeId,
        createOrderDto.orderDetails.map((orderDetail) => orderDetail.productId),
      ),
    ]);

    if (storeDb.products.length === 0) {
      throw new BadRequestException();
    }

    const productsDbDictionary: IProductDictionary = this.productsService.getProductDictionary(
      storeDb.products,
    );

    this.service.checkOrderAvailabilities(
      createOrderDto,
      productsDbDictionary,
      storeDb,
    );

    const computeCheckout: IComputeCheckout = this.service.computeCheckout(
      createOrderDto,
      productsDbDictionary,
    );

    // Get url gate from MangoPay
    const paymentUrl = await this.mangoPayService.createPayInsCardWeb({
      userId: userDb.id,
      userMangoPayId: userDb.mangoPayId,
      producerWalletId: storeDb.user.mangoPayWalletId,
      amount: computeCheckout.total,
    });

    // Save order with Transaction ID
    await this.service.create({
      status: OrderState.PENDING,
      total: computeCheckout.total,
      orderDetails: computeCheckout.orderDetails,
      customerId: req.user.id,
      sellerId: storeDb.userId,
      transactionId: paymentUrl.Id,
      storeId: storeDb.id,
    });

    // Return url payment for user
    return {
      url: paymentUrl.RedirectURL,
    };
  }

  @Override()
  @Patch(':id')
  async updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Order,
    @Param('id') id: string,
  ): Promise<Order> {
    const orderFinal = await this.service.findOne(id, {
      relations: [
        'orderDetails',
        'orderDetails.product',
        'seller',
        'seller.stores',
        'seller.stores.storeTimeSlots',
        'seller.stores.address',
        'customer',
      ],
    });

    if (!orderFinal) {
      throw new NotFoundException();
    }

    if (dto.status === OrderState.FINISHED) {
      // update stock
      const updatedProducts = orderFinal.orderDetails.map((orderDetail) => {
        const stock = orderDetail.product.stock - orderDetail.quantity;
        if (stock < 0) {
          throw new HttpException(
            {
              message: 'Error product stock',
              error: 'orders-0001',
            },
            200,
          );
        }

        orderDetail.product.stock = stock;
        return orderDetail.product;
      });
      await this.productsService.bulkUpdate(updatedProducts);

      // send invoice by email
      const pdfBuffer = await this.pdfService.createInvoice(orderFinal);
      await this.emailService.sendInvoice(
        orderFinal,
        pdfBuffer.toString('base64'),
      );

      await this.userService.payout(orderFinal);
    }

    // si refuse => email de refus + remboursement
    if (dto.status === OrderState.REFUSED) {
      // email de refus
      await this.emailService.sendOrderRefused(orderFinal);
      // remboursement
      await this.userService.refund(orderFinal);
    }
    return await this.service.updateOne(req, { status: dto.status });
  }
}
