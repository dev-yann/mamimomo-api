import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { IAddress } from '@mamimomo/mamimomo-core';
import { Store } from '../../store/entities/store.entity';

@Entity()
export class Address implements IAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @OneToOne(() => Store, (store) => store.address)
  store: Store;
}
