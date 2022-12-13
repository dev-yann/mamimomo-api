import { Injectable } from '@nestjs/common';
import * as mailjet from 'node-mailjet';
import { Email } from 'node-mailjet';
import { ConfigService } from '@nestjs/config';
import { Order } from '../orders/entities/order.entity';
import { I18nService } from 'nestjs-i18n';
import { Day } from '@mamimomo/mamimomo-core';
import { $enum } from 'ts-enum-util';
import * as env from 'env-var';
import * as currency from 'currency.js';

@Injectable()
export class EmailService {
  private mailJetClient: Email.Client;
  constructor(
    private configService: ConfigService,
    private readonly i18n: I18nService,
  ) {
    this.mailJetClient = mailjet.connect(
      configService.get('MAILJET_API_KEY'),
      configService.get('MAILJET_SECRET'),
    );
  }

  get postRequest() {
    return this.mailJetClient.post('send', { version: 'v3.1' });
  }

  async sendInvoice(order: Order, base64Content: string) {
    const timeSlots = await Promise.all(
      order.seller.stores[0].storeTimeSlots.map(async (timeSlot) => {
        const day = await this.i18n.translate(
          'days.' + $enum(Day).getKeyOrThrow(timeSlot.day),
        );
        const obj = {
          // prettier-ignore
          "day": day,
          start: ((timeSlot.start as unknown) as string).slice(0, 5),
          end: ((timeSlot.start as unknown) as string).slice(0, 5),
        };

        return obj;
      }),
    );

    return await this.postRequest.request({
      Messages: [
        {
          From: {
            Email: this.configService.get('MAILJET_NO_REPLY'),
            Name: 'Mamimomo',
          },
          To: [
            {
              Email: order.customer.email,
            },
          ],
          TemplateID: 3088446,
          TemplateLanguage: true,
          TemplateErrorReporting: {
            Email: 'noreply@mamimomo.com',
            Name: 'Your name',
          },
          TemplateErrorDeliver: true,
          Subject: 'Mamimomo - Facture',
          Variables: {
            firstname: order.customer.firstName,
            total_price: currency(order.total).divide(100).value,
            order_date: order.createdAt,
            order_id: order.id,
            street: order.seller.stores[0].address.street,
            city: order.seller.stores[0].address.city,
            postalCode: order.seller.stores[0].address.postalCode,
            storeTimeSlots: timeSlots,
          },
          Attachments: [
            {
              ContentType: 'application/pdf',
              base64Content,
              Filename: 'facture.pdf',
            },
          ],
        },
      ],

      SandboxMode: env.get('MAILJET_SANDBOX').asBool(),
    });
  }

  async sendOrderRefused(order: Order) {
    return this.postRequest.request({
      Messages: [
        {
          From: {
            Email: this.configService.get('MAILJET_NO_REPLY'),
            Name: 'Mamimomo',
          },
          To: [
            {
              Email: order.customer.email,
            },
          ],
          TemplateID: 3094960,
          TemplateLanguage: true,
          TemplateErrorReporting: {
            Email: 'noreply@mamimomo.com',
            Name: 'Your name',
          },
          TemplateErrorDeliver: true,
          Subject: 'Mamimomo - Facture',
          Variables: {
            firstname: order.customer.firstName,
            seller: order.seller.stores[0].name,
          },
        },
      ],

      SandboxMode: env.get('MAILJET_SANDBOX').asBool(),
    });
  }
}
