import { Test, TestingModule } from '@nestjs/testing';
import { StoreTimeSlotsController } from './store-time-slots.controller';
import { StoreTimeSlotsService } from './store-time-slots.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StoreTimeSlot } from './entities/store-time-slot.entity';
import { MockRepository } from '../../utils/MockRepository';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { ConfigService } from '@nestjs/config';

describe('StoreTimeSlotsController', () => {
  let controller: StoreTimeSlotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreTimeSlotsController],
      providers: [
        StoreTimeSlotsService,
        UserService,
        {
          provide: getRepositoryToken(StoreTimeSlot),
          useValue: new MockRepository(),
        },
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

    controller = module.get<StoreTimeSlotsController>(StoreTimeSlotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
