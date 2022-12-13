import { IsNotEmpty } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  street: string;
  @IsNotEmpty()
  city: string;
  @IsNotEmpty()
  postalCode: string;
}
