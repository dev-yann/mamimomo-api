import { IsNotEmpty } from 'class-validator';

export class CreateOrderDetailDto {
  @IsNotEmpty()
  quantity: number;
  @IsNotEmpty()
  productId: string;
}
