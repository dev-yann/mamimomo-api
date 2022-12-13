import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Point } from 'geojson';
import { IStore } from '@mamimomo/mamimomo-core';
import { StoreTimeSlot } from '../../store-time-slots/entities/store-time-slot.entity';
import { Address } from '../../address/entities/address.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Store implements IStore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('geometry', {
    nullable: true,
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  coordinates: Point;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  publish: boolean;

  @OneToOne(() => Address, (address) => address.store, { cascade: ['insert'] })
  @JoinColumn()
  address: Address;

  @ManyToOne(() => User, (user) => user.stores)
  user!: User;

  @OneToMany(() => StoreTimeSlot, (storeTimeSlot) => storeTimeSlot.store)
  storeTimeSlots: StoreTimeSlot[];

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];
}
