import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IOrder, OrderState } from '@mamimomo/mamimomo-core';
import { OrderDetail } from '../../order-details/entities/order-detail.entity';
import { User } from '../../user/entities/user.entity';
import { Expose } from 'class-transformer';
import * as currency from 'currency.js';
import { Store } from '../../store/entities/store.entity';
@Entity()
export class Order implements IOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: OrderState;

  @Column()
  total: number;

  @Column()
  customerId: string;

  @Column()
  sellerId: string;

  @Column({ nullable: false })
  transactionId: string;

  @Column({
    nullable: true, // due to migration, value is mandatory
  })
  storeId: string;

  @ManyToOne(() => Store)
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

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: ['insert'],
  })
  orderDetails: OrderDetail[];

  @ManyToOne(() => User)
  customer: User;

  @ManyToOne(() => User)
  seller: User;

  @Expose()
  get totalString(): string {
    return `${currency(this.total).divide(100).toString()}€`;
  }
}
