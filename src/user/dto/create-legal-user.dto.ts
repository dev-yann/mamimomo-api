import { IsEmail, IsISO31661Alpha2, IsNotEmpty } from 'class-validator';
import { CountryISO } from 'mangopay2-nodejs-sdk/typings/types';
import { HeadQuartersDto } from './head-quarters.dto';

export class CreateLegalUserDto {
  @IsEmail()
  Email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  LegalRepresentativeFirstName: string;
  @IsNotEmpty()
  LegalRepresentativeLastName: string;
  @IsNotEmpty()
  LegalRepresentativeBirthday: number;
  @IsISO31661Alpha2()
  LegalRepresentativeNationality: CountryISO;
  @IsISO31661Alpha2()
  LegalRepresentativeCountryOfResidence;
  @IsNotEmpty()
  HeadquartersAddress: HeadQuartersDto;
  @IsNotEmpty()
  Name: string; // nom de l'entreprise

  phone?: string;
}
