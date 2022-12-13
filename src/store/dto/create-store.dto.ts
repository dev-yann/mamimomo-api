import { Point } from 'geojson';
import { IsBoolean, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAddressDto {
  @IsNotEmpty()
  street: string;
  @IsNotEmpty()
  city: string;
  @IsNotEmpty()
  postalCode: string;
}

export class CreateStoreDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @ValidateNested()
  @Type(() => PointDto)
  @IsNotEmpty()
  coordinates: Point;
  @ValidateNested()
  @Type(() => CreateAddressDto)
  @IsNotEmpty()
  address: CreateAddressDto;
  image: string;
}

class PointDto {
  @IsNotEmpty()
  type: 'Point';
  @IsNotEmpty()
  coordinates: [number, number];
}
