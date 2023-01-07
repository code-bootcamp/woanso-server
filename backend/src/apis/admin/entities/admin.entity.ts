import { Field, ObjectType } from '@nestjs/graphql';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id: string;

  @Field(() => String)
  @Column({ nullable: true })
  email: string;

  // @Field(() => String)
  @Column({ nullable: true })
  password: string;

  @Field(() => String)
  @Column({ nullable: true })
  phone: string;

  @CreateDateColumn()
  createdAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
