import {
  IsIBAN,
  IsISO31661Alpha2,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CountryISO } from 'mangopay2-nodejs-sdk/typings/types';
import MangoPay from 'mangopay2-nodejs-sdk';
import AddressData = MangoPay.address.AddressData;

export class AddressDto implements AddressData {
  @IsNotEmpty()
  AddressLine1: string;
  AddressLine2: string;
  @IsNotEmpty()
  City: string;
  @IsNotEmpty()
  Region: string;
  @IsNotEmpty()
  PostalCode: string;
  @IsNotEmpty()
  @IsISO31661Alpha2()
  Country: CountryISO;
}

export class CreateBankAccountDto {
  @IsNotEmpty()
  @IsString()
  OwnerName: string;
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  OwnerAddress: AddressDto[];
  @IsIBAN()
  @IsNotEmpty()
  IBAN: string;
}
