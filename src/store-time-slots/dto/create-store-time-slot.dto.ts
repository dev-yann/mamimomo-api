import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { StoreTimeSlot } from '../entities/store-time-slot.entity';
import { Type } from 'class-transformer';

export class CreateStoreTimeSlotDto {
  @IsNotEmpty()
  store: string;
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => StoreTimeSlot)
  data: StoreTimeSlot[];
}
