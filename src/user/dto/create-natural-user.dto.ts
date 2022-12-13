import {
  IsEmail,
  IsISO31661Alpha2,
  IsNotEmpty,
  Matches,
  MinLength,
} from 'class-validator';
import { CountryISO } from 'mangopay2-nodejs-sdk/typings/types';
import { Match } from '../../../utils/decorator/match.decorator';

export class CreateNaturalUserDto {
  @IsEmail()
  Email: string;
  @MinLength(6)
  @Matches('[`!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?~]')
  @Matches('\\w')
  password: string;
  @IsNotEmpty()
  FirstName: string;
  @IsNotEmpty()
  LastName: string;
  @IsNotEmpty()
  Birthday: number; // required for mangopay
  @IsISO31661Alpha2()
  Nationality: CountryISO;
  @IsISO31661Alpha2()
  CountryOfResidence;
  @Match('password')
  passwordConfirm: string;

  phone?: string;
}
