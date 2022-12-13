import { Category, IOrderDetail, Unit } from '@mamimomo/mamimomo-core';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class OrderDetail implements IOrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  title: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
  })
  price: number;

  @Column()
  total: number;

  @Column()
  quantity: number;

  @Column()
  productId: string;

  @ManyToOne(() => Product)
  product!: Product;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  order: Order;

  @Column({
    nullable: true,
  })
  unit: Unit;

  @Column({
    nullable: true,
  })
  category: Category;
}
