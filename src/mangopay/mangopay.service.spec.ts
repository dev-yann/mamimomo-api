import { Test, TestingModule } from '@nestjs/testing';
import { MangopayService } from './mangopay.service';
import { HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mockedConfigService from '../../utils/MockConfig';

describe('MangopayService', () => {
  let service: MangopayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MangopayService,
        {
          provide: HttpService,
          useValue: HttpService,
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
      ],
    }).compile();

    service = module.get<MangopayService>(MangopayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
