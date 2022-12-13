import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { StoreModule } from './store/store.module';
import { ProductsModule } from './products/products.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { OrdersModule } from './orders/orders.module';
import { OrderDetailsModule } from './order-details/order-details.module';
import { StoreTimeSlotsModule } from './store-time-slots/store-time-slots.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AddressModule } from './address/address.module';
import { MangopayModule } from './mangopay/mangopay.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { StorageModule } from './storage/storage.module';
import { HooksModule } from './hooks/hooks.module';
import { EmailModule } from './email/email.module';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRoot(),
    UserModule,
    StoreModule,
    ProductsModule,
    OrganizationsModule,
    OrdersModule,
    OrderDetailsModule,
    StoreTimeSlotsModule,
    AddressModule,
    MangopayModule,
    AuthModule,
    StorageModule,
    HooksModule,
    EmailModule,
    I18nModule.forRoot({
      fallbackLanguage: 'fr',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, 'i18n'),
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
