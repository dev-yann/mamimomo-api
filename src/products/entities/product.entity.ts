import { Category, IProduct, Unit } from '@mamimomo/mamimomo-core';
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Store } from '../../store/entities/store.entity';
import { Expose } from 'class-transformer';
import * as currency from 'currency.js';

@Entity()
export class Product implements IProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  stock: number;

  @Column()
  price: number;

  @Column({ nullable: true })
  sold: number;

  @Column({ nullable: true })
  image: string;

  @Column()
  storeId: string;

  @Column()
  unit: Unit;

  @Column()
  category: Category;

  @Column({ nullable: true })
  publish: boolean;

  @ManyToOne(() => Store, (store) => store.products)
  store: Store;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp without time zone',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp without time zone',
  })
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp without time zone',
  })
  deletedAt!: Date;

  @AfterLoad()
  loadPrice() {
    this.price = this.price / 100;
  }

  @Expose()
  get publicPrice(): number {
    return (
      currency(this.price).multiply(process.env.MAMIMOMO_FEES).intValue / 100
    );
  }
}
