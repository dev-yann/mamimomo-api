import { Module } from '@nestjs/common';
import { StoreTimeSlotsService } from './store-time-slots.service';
import { StoreTimeSlotsController } from './store-time-slots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreTimeSlot } from './entities/store-time-slot.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([StoreTimeSlot])],
  controllers: [StoreTimeSlotsController],
  providers: [StoreTimeSlotsService],
})
export class StoreTimeSlotsModule {}
