import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetailsService } from '../order-details/order-details.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { PdfService } from '../service/pdf.service';
import { ProductsModule } from '../products/products.module';
import { StorageModule } from '../storage/storage.module';
import { StoreService } from '../store/store.service';
import { StoreModule } from '../store/store.module';
import { MangopayModule } from '../mangopay/mangopay.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    UserModule,
    ProductsModule,
    StorageModule,
    StoreModule,
    MangopayModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrderDetailsService,
    EmailService,
    ConfigService,
    PdfService,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
