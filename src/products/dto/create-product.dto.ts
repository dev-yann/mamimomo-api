import { Category, Unit } from '@mamimomo/mamimomo-core';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  stock: number;
  image: {
    mime: string;
    ext: string;
  };
  @IsNotEmpty()
  unit: Unit;
  @IsNotEmpty()
  category: Category;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  publish: boolean;
}
