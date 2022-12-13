import { IsNumberString } from 'class-validator';

export class PayinUser {
  @IsNumberString()
  id: number;
}
