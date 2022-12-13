import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Store } from '../../store/entities/store.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import { IOrganization, IUser, IStore, Roles } from '@mamimomo/mamimomo-core';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Exclude()
  passwordConfirm: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ length: 15 })
  phone: string;

  @Column({
    type: 'timestamp without time zone',
  })
  birthday: Date;

  @Column({ length: 2 })
  countryOfResidence: string;

  @Column()
  nationality: string;

  @Column()
  mangoPayId: string;

  @Column()
  mangoPayWalletId: string;

  @Column({ nullable: true })
  organizationId: string;

  @Column({ nullable: true })
  role: Roles;

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

  @OneToMany(() => Store, (store) => store.user)
  stores: IStore[];

  @ManyToOne(() => Organization, (organization) => organization.users)
  organization: IOrganization;
}
