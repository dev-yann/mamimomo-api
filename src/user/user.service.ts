import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLegalUserDto } from './dto/create-legal-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import MangoPay = require('mangopay2-nodejs-sdk');
import { CreateNaturalUserDto } from './dto/create-natural-user.dto';
import WalletData = MangoPay.wallet.WalletData;
import { Organization } from '../organizations/entities/organization.entity';
import KycDocumentType = MangoPay.kycDocument.KycDocumentType;
import { kycDocument } from 'mangopay2-nodejs-sdk';
import KycDocumentData = MangoPay.kycDocument.KycDocumentData;
import { Roles } from '@mamimomo/mamimomo-core';
import { CreateBankAccountDto } from '../mangopay/dto/create-bank-account.dto';
import { Order } from '../orders/entities/order.entity';
import * as currency from 'currency.js';

@Injectable()
export class UserService {
  private api: MangoPay;
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    private configService: ConfigService,
  ) {
    const validConfig: MangoPay.base.Config = {
      clientId: configService.get('MANGOPAY_CLIENT_ID'),
      clientApiKey: configService.get('MANGOPAY_API_KEY'),
      baseUrl: configService.get('MANGOPAY_BASE_URL'),
    };

    this.api = new MangoPay(validConfig);
  }

  findOne(id: string) {
    return this.repo.findOne(id);
  }

  findOneByEmail(email: string) {
    return this.repo.findOne({ email: email });
  }

  findOneByMangoPayId(mangoPayId: string) {
    return this.repo.findOne({ mangoPayId });
  }

  findOneWithRelation(id: string, relations: string[]) {
    return this.repo.findOne(id, {
      relations,
    });
  }

  async createLegalUser(createUserDto) {
    const userLegal = await this.api.Users.create(
      new this.api.models.UserLegal({
        ...createUserDto,
        LegalPersonType: 'SOLETRADER',
      }),
    );

    const mangoPayWallet = await this.api.Wallets.create({
      Owners: [userLegal.Id],
      Description: `Client wallet of ${userLegal.Email}`,
      Currency: 'EUR',
    });

    return this.hydrateAndSaveUserPro(createUserDto, mangoPayWallet);
  }

  async createKycDocument(user: User, kycDocumentType: KycDocumentType) {
    return await this.api.Users.createKycDocument(
      user.mangoPayId,
      new this.api.models.KycDocument({
        Type: kycDocumentType,
      }),
    );
  }

  async createNaturalUser(createUserDto: CreateNaturalUserDto) {
    const userNatural = await this.api.Users.create(
      new this.api.models.UserNatural(createUserDto),
    );
    const wallet = await this.api.Wallets.create({
      Owners: [userNatural.Id],
      Description: `Client wallet of ${userNatural.Email}`,
      Currency: 'EUR',
    });

    return this.hydrateAndSaveUser(createUserDto, wallet);
  }

  private async hydrateAndSaveUser(
    dto: CreateNaturalUserDto,
    mangoPayWallet: WalletData,
  ) {
    const user = new User();
    for (const property in dto) {
      user[`${property.charAt(0).toLowerCase()}${property.slice(1)}`] =
        dto[property];
    }

    user.mangoPayId = mangoPayWallet.Owners[0];
    user.mangoPayWalletId = mangoPayWallet.Id;
    user.birthday = new Date(dto.Birthday * 1000);
    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());

    return await this.repo.save(user);
  }

  private async hydrateAndSaveUserPro(
    dto: CreateLegalUserDto,
    mangoPayWallet: WalletData,
  ) {
    const user = new User();
    for (const property in dto) {
      if (property.includes('LegalRepresentative')) {
        const propertyName = property.replace('LegalRepresentative', '');
        if (
          !user.hasOwnProperty(
            `${propertyName.charAt(0).toLowerCase()}${propertyName.slice(1)}`,
          )
        ) {
          user[
            `${propertyName.charAt(0).toLowerCase()}${propertyName.slice(1)}`
          ] = dto[property];
        }
      }

      user[`${property.charAt(0).toLowerCase()}${property.slice(1)}`] =
        dto[property];
    }

    user.mangoPayId = mangoPayWallet.Owners[0];
    user.mangoPayWalletId = mangoPayWallet.Id;
    user.birthday = new Date(dto.LegalRepresentativeBirthday * 1000);
    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());

    return await this.organizationRepository.save(
      this.organizationRepository.create({
        title: dto.Name,
        users: [user],
      }),
    );
  }

  async findPayIn(transactionId: number) {
    try {
      return await this.api.PayIns.get(String(transactionId));
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async uploadIdentity(userId: string, kycDocumentId: string, file) {
    await this.api.Users.createKycPage(userId, kycDocumentId, {
      File: await file.buffer.toString('base64'),
    });
  }

  async getLastKycDocument(
    mangopayId: string,
    type: KycDocumentType = 'IDENTITY_PROOF',
  ): Promise<KycDocumentData | null> {
    const documents = await this.getKycDocuments(
      mangopayId,
      type,
      null,
      'CreationDate:desc',
      1,
    );

    if (documents.length === 1) {
      return documents[0];
    }
    return null;
  }

  async getKycDocuments(
    mangopayId: string,
    type: KycDocumentType | null = null,
    status: string | null = null,
    sort: string | null = null,
    perPage: number | null = null,
  ): Promise<kycDocument.KycDocumentData[]> {
    return await this.api.Users.getKycDocuments(mangopayId, {
      parameters: {
        ...(type ? { Type: type } : {}),
        ...(status ? { Status: status } : {}),
        ...(sort ? { Sort: sort as MangoPay.base.ColumnAndDirection } : {}),
        ...(perPage ? { Per_Page: perPage } : {}),
      },
    });
  }

  async submitKycDocument(mangopayId: string, kycDocumentId: string) {
    return await this.api.Users.updateKycDocument(mangopayId, {
      Status: 'VALIDATION_ASKED',
      Id: kycDocumentId,
    });
  }

  async setRole(userId: string, role: Roles) {
    return await this.repo.save({ id: userId, role });
  }

  async getBankAccounts(mangoId: string) {
    return await this.api.Users.getBankAccounts(mangoId);
  }

  async disableBankAccount(userId, bankAccountId) {
    return await this.api.Users.deactivateBankAccount(userId, bankAccountId);
  }

  async createBankAccount(
    userId: string,
    bankAccountDto: CreateBankAccountDto,
  ) {
    const accountPayload = {
      OwnerName: bankAccountDto.OwnerName,
      OwnerAddress: bankAccountDto.OwnerAddress[0],
      Details: new this.api.models.BankAccountDetailsIBAN({
        IBAN: bankAccountDto.IBAN,
      }),
      Type: 'IBAN',
      AccountNumber: '',
      ABA: '',
    };

    return await this.api.Users.createBankAccount(
      userId,
      new this.api.models.BankAccount(accountPayload),
    );
  }

  async refund(order: Order) {
    return await this.api.PayIns.createRefund(order.transactionId, {
      AuthorId: order.customer.mangoPayId,
    });
  }

  async payout(order: Order) {
    const bankAccounts = await this.getBankAccounts(order.seller.mangoPayId);
    const bankAccount = bankAccounts.find((account) => account.Active === true);

    const amountFees =
      order.seller.mangoPayId === '1778881738'
        ? order.total -
          currency(order.total).divide(
            this.configService.get('MAMIMOMO_FEES_PREMIUM'),
          ).value
        : order.total -
          currency(order.total).divide(this.configService.get('MAMIMOMO_FEES'))
            .value;
    return await this.api.PayOuts.create({
      AuthorId: order.seller.mangoPayId,
      DebitedFunds: {
        Currency: 'EUR',
        Amount: order.total,
      },
      Fees: {
        Currency: 'EUR',
        Amount: amountFees,
      },
      BankAccountId: bankAccount.Id,
      DebitedWalletId: order.seller.mangoPayWalletId,
      PaymentType: 'BANK_WIRE',
    });
  }
}
