import { Field, ObjectType, Int, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum POINT_TRANSACTION_STATUS_ENUM {
  PAYMENT = 'PAYMENT',
  CANCEL = 'CANCEL',
}

registerEnumType(POINT_TRANSACTION_STATUS_ENUM, {
  name: 'POINT_TRANSACTION_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class PointTransaction {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  impUid: string;

  @Column()
  @Field(() => Int)
  amount: number;

  @Field(() => POINT_TRANSACTION_STATUS_ENUM)
  @Column({ type: 'enum', enum: POINT_TRANSACTION_STATUS_ENUM })
  status: string;

  @Field(() => User)
  @ManyToOne(() => User)
  user: User;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
