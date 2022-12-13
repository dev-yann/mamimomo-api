import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { PdfService } from '../service/pdf.service';

@Module({
  providers: [EmailService, ConfigService, PdfService],
})
export class EmailModule {}
