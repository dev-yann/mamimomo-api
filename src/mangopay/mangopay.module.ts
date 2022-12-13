import { Module } from '@nestjs/common';
import { MangopayService } from './mangopay.service';
import { MangopayController } from './mangopay.controller';
import { HttpModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        auth: {
          username: configService.get('MANGOPAY_CLIENT_ID'),
          password: configService.get('MANGOPAY_API_KEY'),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProductsModule,
  ],
  controllers: [MangopayController],
  providers: [MangopayService, ConfigService],
  exports: [MangopayService],
})
export class MangopayModule {}
