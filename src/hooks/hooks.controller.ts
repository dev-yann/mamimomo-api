import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from '../user/user.service';

import { Roles } from '@mamimomo/mamimomo-core';
import { Public } from '../decorators/public.decorator';
import MangoPay from 'mangopay2-nodejs-sdk';
import { MangopayService } from '../mangopay/mangopay.service';
import { OrdersService } from '../orders/orders.service';

@Controller('hooks')
export class HooksController {
  constructor(
    private readonly userService: UserService,
    private readonly mangoPayService: MangopayService,
    private readonly orderService: OrdersService,
  ) {}
  @Get('/user-validated')
  @Public()
  async userValidated(@Query('RessourceId') resourceId: string) {
    const user = await this.userService.findOneByMangoPayId(resourceId);
    if (user && user.role !== Roles.VERIFIED_USER_PRO) {
      await this.userService.setRole(user.id, Roles.VERIFIED_USER_PRO);
    }
  }

  @Get('payin')
  @Public()
  async onPayin(
    @Query('RessourceId') resourceId: string,
    @Query('EventType') eventType: MangoPay.event.EventType,
  ) {
    const payin = await this.mangoPayService.getPayIn(resourceId);
    if (payin) {
      await this.orderService.updateOrderPaymentStatus(payin);
    }
  }
}
