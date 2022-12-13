import { Module } from '@nestjs/common';

import { HooksController } from './hooks.controller';
import { UserModule } from '../user/user.module';
import { MangopayModule } from '../mangopay/mangopay.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [UserModule, MangopayModule, OrdersModule],
  controllers: [HooksController],
})
export class HooksModule {}
