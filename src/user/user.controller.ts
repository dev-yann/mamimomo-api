import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  BadRequestException,
  UseInterceptors,
  UnauthorizedException,
  HttpCode,
  UploadedFiles,
  Delete,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../decorators/public.decorator';
import { PayinUser } from './dto/payin-user';
import { CreateNaturalUserDto } from './dto/create-natural-user.dto';
import { CreateLegalUserDto } from './dto/create-legal-user.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import MangoPay from 'mangopay2-nodejs-sdk';
import KycDocumentData = MangoPay.kycDocument.KycDocumentData;
import { CreateBankAccountDto } from '../mangopay/dto/create-bank-account.dto';
import { mangopayReference } from '../config/reference/mangopay.reference';
import { multerOptions } from '../config/multer.config';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/natural')
  @Public()
  async createNatural(@Body() createUserDto: CreateNaturalUserDto) {
    if (await this.userService.findOneByEmail(createUserDto.Email)) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'e-mail already exist',
        inputErrors: { Email: ['user-0001'] },
      });
    }

    return this.userService.createNaturalUser(createUserDto);
  }

  // Todo: Pour le moment, seulement inscritpion pour les auto-entrepreneurs et entreprises individuelles (soletrader)
  @Post('/legal')
  @Public()
  async createLegal(@Body() createUserDto: CreateLegalUserDto) {
    if (await this.userService.findOneByEmail(createUserDto.Email)) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'e-mail already exist',
        inputErrors: { Email: ['user-0001'] },
      });
    }

    return this.userService.createLegalUser(createUserDto);
  }

  @Get('token')
  findByToken(@Request() req) {
    return this.userService.findOneWithRelation(req.user.id, [
      'stores',
      'stores.address',
    ]);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get('/payIns/:id')
  async validation(@Param() params: PayinUser) {
    const { Status } = await this.userService.findPayIn(params.id);
    return Status;
  }

  @Get('/kyc/identity')
  async identity(@Request() req) {
    const user = await this.userService.findOne(req.user.id);

    if (!user || !user.organizationId) {
      throw new UnauthorizedException();
    }

    return await this.userService.getLastKycDocument(user.mangoPayId);
  }

  @Get('/kyc/kbis')
  async kbis(@Request() req) {
    const user = await this.userService.findOne(req.user.id);

    if (!user || !user.organizationId) {
      throw new UnauthorizedException();
    }

    return await this.userService.getLastKycDocument(
      user.mangoPayId,
      'REGISTRATION_PROOF',
    );
  }

  @Post('/kyc/identity')
  @HttpCode(200)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'verso', maxCount: 1 },
        { name: 'recto', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  async uploadIdentity(
    @Request() req,
    @UploadedFiles()
    files: { verso: [Express.Multer.File]; recto: [Express.Multer.File] },
  ) {
    // because of mangopay we need to check min size
    if (
      files.verso[0].size <= mangopayReference.minIdentityProofSize ||
      files.recto[0].size <= mangopayReference.minIdentityProofSize
    ) {
      throw new HttpException(
        {
          message: 'Min file size is 32kb',
          error: 'user-0002',
        },
        200,
      );
    }
    const user = await this.userService.findOne(req.user.id);

    if (!user || !user.organizationId) {
      throw new UnauthorizedException();
    }

    const kycDocument: KycDocumentData | null = await this.userService.getLastKycDocument(
      user.mangoPayId,
    );

    if (
      !kycDocument ||
      kycDocument.Status === 'REFUSED' ||
      kycDocument.Status === 'CREATED'
    ) {
      const newKycDocument = await this.userService.createKycDocument(
        user,
        'IDENTITY_PROOF',
      );

      await Promise.all([
        this.userService.uploadIdentity(
          user.mangoPayId,
          newKycDocument.Id,
          files.verso[0],
        ),
        this.userService.uploadIdentity(
          user.mangoPayId,
          newKycDocument.Id,
          files.recto[0],
        ),
      ]);

      return this.userService.submitKycDocument(
        user.mangoPayId,
        newKycDocument.Id,
      );
    }

    throw new UnauthorizedException();
  }

  @Post('/kyc/kbis')
  @HttpCode(200)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'kbis', maxCount: 1 }], multerOptions),
  )
  async uploadKbis(
    @Request() req,
    @UploadedFiles()
    files: { kbis: [Express.Multer.File] },
  ) {
    const user = await this.userService.findOne(req.user.id);

    if (!user || !user.organizationId) {
      throw new UnauthorizedException();
    }

    const kycDocument: KycDocumentData | null = await this.userService.getLastKycDocument(
      user.mangoPayId,
      'REGISTRATION_PROOF',
    );

    if (!kycDocument || kycDocument.Status === 'REFUSED') {
      const newKycDocument = await this.userService.createKycDocument(
        user,
        'REGISTRATION_PROOF',
      );

      await Promise.all([
        this.userService.uploadIdentity(
          user.mangoPayId,
          newKycDocument.Id,
          files.kbis[0],
        ),
      ]);

      return this.userService.submitKycDocument(
        user.mangoPayId,
        newKycDocument.Id,
      );
    }

    throw new UnauthorizedException();
  }

  @Get('bank/account')
  async getBankAccounts(@Request() req) {
    const user = await this.userService.findOne(req.user.id);
    return this.userService.getBankAccounts(user.mangoPayId);
  }

  @Delete('bank/account')
  async deleteBankAccounts(@Request() req) {
    const user = await this.userService.findOne(req.user.id);
    const bankAccounts = await this.userService.getBankAccounts(
      user.mangoPayId,
    );

    const bankAccount = bankAccounts.find((account) => account.Active === true);

    if (!bankAccount) {
      throw new UnauthorizedException();
    }

    return this.userService.disableBankAccount(user.mangoPayId, bankAccount.Id);
  }

  @Post('bank/account')
  async postBankAccount(
    @Request() req,
    @Body() bankAccountDto: CreateBankAccountDto,
  ) {
    const user = await this.userService.findOne(req.user.id);
    const bankAccounts = await this.userService.getBankAccounts(
      user.mangoPayId,
    );

    if (bankAccounts.find((account) => account.Active === true)) {
      throw new UnauthorizedException();
    }

    return await this.userService.createBankAccount(
      user.mangoPayId,
      bankAccountDto,
    );
  }
}
