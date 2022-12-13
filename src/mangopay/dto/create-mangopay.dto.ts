import { IsInt, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { UpdateProductDto } from '../../products/dto/update-product.dto';

export class CreateMangopayDto {
  @IsInt()
  amount: number;
  @IsNotEmpty()
  producer: string;
  @IsNotEmpty()
  @ValidateNested()
  products: UpdateProductDto[];
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  quantities: number[];
}
