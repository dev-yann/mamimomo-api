import { Test, TestingModule } from '@nestjs/testing';
import { HooksController } from './hooks.controller';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { MockRepository } from '../../utils/MockRepository';
import { Organization } from '../organizations/entities/organization.entity';
import { ConfigService } from '@nestjs/config';

describe('HooksController', () => {
  let controller: HooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HooksController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: new MockRepository(),
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: new MockRepository(),
        },
        ConfigService,
      ],
    }).compile();

    controller = module.get<HooksController>(HooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
