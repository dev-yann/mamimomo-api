import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateOrderDetailDto } from '../../order-details/dto/create-order-detail.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => CreateOrderDetailDto)
  @IsNotEmpty()
  orderDetails: CreateOrderDetailDto[];
  @IsNotEmpty()
  storeId: string;
}
