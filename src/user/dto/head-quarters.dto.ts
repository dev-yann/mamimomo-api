import { IsNotEmpty } from 'class-validator';

export class HeadQuartersDto {
  @IsNotEmpty()
  AddressLine1: string;
  @IsNotEmpty()
  City: string;
  @IsNotEmpty()
  Region: string;
  @IsNotEmpty()
  PostalCode: string;
  @IsNotEmpty()
  Country: string;
}
