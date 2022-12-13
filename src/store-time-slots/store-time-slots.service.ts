import { Injectable } from '@nestjs/common';
import { CreateStoreTimeSlotDto } from './dto/create-store-time-slot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreTimeSlot } from './entities/store-time-slot.entity';
import { Repository } from 'typeorm';
import { TimeSlotFormType } from '@mamimomo/mamimomo-core';

@Injectable()
export class StoreTimeSlotsService {
  constructor(
    @InjectRepository(StoreTimeSlot)
    private readonly repo: Repository<StoreTimeSlot>,
  ) {}

  async findByStore(storeId: string): Promise<TimeSlotFormType> {
    const storeTimeSlots = await this.repo
      .createQueryBuilder('slots')
      .where('slots.storeId = :storeId', { storeId })
      .select([
        '*',
        'TO_CHAR(slots.start, \'HH24:MM\') "start"',
        'TO_CHAR(slots.end, \'HH24:MM\') "end"',
      ])
      .execute();

    const slots: TimeSlotFormType = {};
    storeTimeSlots.map((slot) => {
      if (!slots[slot.day]) {
        slots[slot.day] = [];
      }
      slots[slot.day].push(slot);
    });

    return slots;
  }

  create(createStoreTimeSlotDto: CreateStoreTimeSlotDto) {
    return this.repo.save(createStoreTimeSlotDto.data);
  }

  findOne(id: number) {
    return `This action returns a #${id} storeTimeSlot`;
  }

  removeAll(storeId: string) {
    return this.repo.delete({ storeId });
  }
}
