import {
  HttpService,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';
import { IMangoPayPayInsPayload, IUser } from '@mamimomo/mamimomo-core';
import { CreateMangopayDto } from './dto/create-mangopay.dto';
import MangoPay = require('mangopay2-nodejs-sdk');
import { mangopayReference } from '../config/reference/mangopay.reference';
import CardWebPayInData = MangoPay.payIn.CardWebPayInData;

@Injectable()
export class MangopayService {
  private api: MangoPay;
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    const config: MangoPay.base.Config = {
      clientId: configService.get('MANGOPAY_CLIENT_ID'),
      clientApiKey: configService.get('MANGOPAY_API_KEY'),
      baseUrl: configService.get('MANGOPAY_BASE_URL'),
    };
    this.api = new MangoPay(config);
  }
  redirectToPayWeb(
    user: IUser,
    createMangoDto: CreateMangopayDto,
    producer: IUser,
  ) {
    try {
      return this.httpService
        .post(
          `${this.configService.get(
            'MANGOPAY_BASE_URL',
          )}/v2.01/${this.configService.get(
            'MANGOPAY_CLIENT_ID',
          )}/payins/card/web/`,
          {
            Tag: 'buyer request tag data',
            AuthorId: user.mangoPayId, // mangoPayId
            DebitedFunds: {
              Currency: 'EUR',
              Amount: createMangoDto.amount,
            },
            Fees: {
              Currency: 'EUR',
              Amount: 18,
            },
            ReturnURL: `${this.configService.get(
              'CLIENT_BASE_URL',
            )}/cart/payment/validation`,
            CardType: 'CB_VISA_MASTERCARD',
            CreditedWalletId: producer.mangoPayWalletId, // mangopaywalletid
            SecureMode: 'DEFAULT',
            Culture: 'FR',
          },
        )
        .pipe(map((response) => response.data));
    } catch (e) {
      throw new InternalServerErrorException('Payment');
    }
  }

  async createPayInsCardWeb(
    checkout: IMangoPayPayInsPayload,
  ): Promise<CardWebPayInData> {
    const payIns = new this.api.models.PayIn({
      Tag: `#user ${checkout.userId}`,
      AuthorId: checkout.userMangoPayId,
      Fees: {
        Currency: mangopayReference.defaultCurrency,
        Amount: mangopayReference.defaultFeesAmount,
      },
      DebitedFunds: {
        Currency: mangopayReference.defaultCurrency,
        Amount: checkout.amount,
      },
      ReturnURL: `${this.configService.get('CLIENT_BASE_URL')}${
        mangopayReference.validationPath
      }`,
      CardType: mangopayReference.defaultCardType,
      CreditedWalletId: checkout.producerWalletId,
      SecureMode: mangopayReference.defaultSecureMode,
      PaymentType: 'CARD',
      ExecutionType: 'WEB',
    });

    return await this.api.PayIns.create({
      ...payIns,
      CardType: mangopayReference.defaultCardType,
      ReturnURL: `${this.configService.get('CLIENT_BASE_URL')}${
        mangopayReference.validationPath
      }`,
      Culture: mangopayReference.defaultCulture,
    } as MangoPay.payIn.CreateCardWebPayIn).then(
      (resp) => resp,
      () => {
        throw new InternalServerErrorException();
      },
    );
  }

  async getPayIn(payInId: string) {
    return await this.api.PayIns.get(payInId);
  }
}
