import { Day, IStore, IStoreTimeSlot } from '@mamimomo/mamimomo-core';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Store } from '../../store/entities/store.entity';
import { IsInt, IsMilitaryTime, IsNotEmpty, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

@Entity()
export class StoreTimeSlot implements IStoreTimeSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  @IsInt()
  @Min(1)
  @Max(7)
  day: Day;

  @Column({
    type: 'time without time zone',
    nullable: false,
  })
  @IsMilitaryTime()
  @Transform((start: string) => start.slice(0, 5))
  start: Date;

  @Column({
    type: 'time without time zone',
    nullable: false,
  })
  @IsMilitaryTime()
  @Transform((end: string) => end.slice(0, 5))
  end: Date;

  @Column()
  @IsNotEmpty()
  storeId: string;

  @ManyToOne(() => Store, (store) => store.storeTimeSlots)
  store: IStore;
}
