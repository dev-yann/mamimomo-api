import { PartialType } from '@nestjs/mapped-types';
import { CreateLegalUserDto } from './create-legal-user.dto';

export class UpdateUserDto extends PartialType(CreateLegalUserDto) {}
