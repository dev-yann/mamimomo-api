import { PartialType } from '@nestjs/mapped-types';
import { CreateStoreDto } from './create-store.dto';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
  @IsNotEmpty()
  id: string;
  @IsBoolean()
  @IsOptional()
  publish: boolean; // publishing store after create
}
