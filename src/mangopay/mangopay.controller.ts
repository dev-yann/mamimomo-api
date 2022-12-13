import {
  Body,
  Controller,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { MangopayService } from './mangopay.service';
import { CreateMangopayDto } from './dto/create-mangopay.dto';
import { UserService } from '../user/user.service';
import { ProductsService } from '../products/products.service';
import { In } from 'typeorm';

@Controller('mangopay')
export class MangopayController {
  constructor(
    private readonly mangopayService: MangopayService,
    private readonly userService: UserService,
    private readonly productService: ProductsService,
  ) {}

  // to test, route useless
  /*
  // todo: fix securité le montant doit etre calculé coté back
  @Post('/payins/card/web')
  async create(@Request() req, @Body() createMangoDto: CreateMangopayDto) {
    // check du store
    // is publish
    // is dispos
    const producer = await this.userService.findOneWithRelation(
      createMangoDto.producer,
      ['stores', 'stores.storeTimeSlots'],
    );

    if (!producer || !producer.stores[0]) {
      throw new UnauthorizedException();
    }

    const store = producer.stores[0];

    if (!store.publish || store.storeTimeSlots.length === 0) {
      throw new UnauthorizedException();
    }

    // check des produits
    // is stock
    // is publish
    const products = await this.productService.find({
      id: In(createMangoDto.products.map((product) => product.id)),
    });

    const updatedProducts = products.map((product, index) => {
      if (!product.publish) {
        throw new UnauthorizedException();
      }

      if (product.stock - createMangoDto.quantities[index] < 0) {
        throw new UnauthorizedException();
      }

      // todo: la MAJ de stock se fait après la validation du producteur
      product.stock -= createMangoDto.quantities[index];
      return product;
    });

    // update stock
    await this.productService.bulkUpdate(updatedProducts);

    // payment
    const user = await this.userService.findOne(req.user.id);

 
     * todo: correction
     * créer l'order avec le payins Id
     *
     *
     * (Une fois que le mec à payer, on set l'order paied à true avec hooks)
     * Si pas de paiement on supprime l'order
     
    return this.mangopayService.redirectToPayWeb(
      user,
      createMangoDto,
      producer,
    );
  }
  */
}
