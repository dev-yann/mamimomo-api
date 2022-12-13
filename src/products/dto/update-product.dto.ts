import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty } from 'class-validator';
import { OmitType } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['image'] as const),
) {
  @IsNotEmpty()
  storeId: string;
  @IsNotEmpty()
  id: string;
  image: string | null | { mime: string; ext: string };
}
