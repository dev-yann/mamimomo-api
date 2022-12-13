import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  IComputeCheckout,
  IOrder,
  IOrderDetail,
  IProductDictionary,
  IStore,
  OrderState,
} from '@mamimomo/mamimomo-core';
import { CreateOrderDto } from './dto/create-order.dto';
import { StoreService } from '../store/store.service';
import { ProductsService } from '../products/products.service';
import * as currency from 'currency.js';
import { mangopayReference } from '../config/reference/mangopay.reference';
import { payIn } from 'mangopay2-nodejs-sdk/typings/models/payIn';
import PayInData = payIn.PayInData;

@Injectable()
export class OrdersService extends TypeOrmCrudService<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private storeService: StoreService,
    private productsService: ProductsService,
  ) {
    super(orderRepository);
  }
  async create(order: IOrder) {
    return await this.orderRepository.save(order);
  }

  checkOrderAvailabilities(
    createOrderDto: CreateOrderDto,
    productsDbDictionary: IProductDictionary,
    store: IStore,
  ) {
    // check product availability
    this.productsService.checkProductsAvailability(
      createOrderDto,
      productsDbDictionary,
    );
    // check store availability
    this.storeService.checkStoreAvailability(store);
  }

  computeCheckout(
    createOrderDto: CreateOrderDto,
    productsDbDictionary: IProductDictionary,
  ): IComputeCheckout {
    const orderDetails: IOrderDetail[] = this.generateOrderDetails(
      createOrderDto,
      productsDbDictionary,
    );

    const orderDetailsSum: number = orderDetails.reduce(
      (acc, currentDetails) => {
        return currency(acc + currentDetails.total).value;
      },
      0,
    );

    const total: number = orderDetailsSum + mangopayReference.defaultFeesAmount;

    return {
      orderDetails,
      total,
    };
  }

  async updateOrderPaymentStatus(payIn: PayInData): Promise<void> {
    const order = await this.orderRepository.findOne({
      transactionId: payIn.Id,
    });

    if (order && order.status === OrderState.PENDING) {
      switch (payIn.Status) {
        case 'FAILED':
          order.status = OrderState.PAYMENT_FAILED;
          break;
        case 'SUCCEEDED':
          order.status = OrderState.PAID;
          break;
        default:
          break;
      }

      await this.orderRepository.save(order);
    }
  }

  private generateOrderDetails(
    createOrderDto: CreateOrderDto,
    productsDbDictionary: IProductDictionary,
  ): IOrderDetail[] {
    return createOrderDto.orderDetails.map((detail) => {
      return {
        title: productsDbDictionary[detail.productId].title,
        description: productsDbDictionary[detail.productId].description,
        price: currency(productsDbDictionary[detail.productId].price).intValue,
        total: currency(
          productsDbDictionary[detail.productId].publicPrice * detail.quantity,
        ).intValue,
        quantity: detail.quantity,
        productId: productsDbDictionary[detail.productId].id,
        unit: productsDbDictionary[detail.productId].unit,
        category: productsDbDictionary[detail.productId].category,
      };
    });
  }
}
