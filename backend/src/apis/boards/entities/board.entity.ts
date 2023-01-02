import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @Field(() => Int)
  like: number;

  @Column()
  @Field(() => String)
  content: string;

  //이미지 Url 컬럼
  // 판매 이미지 url
  //대여 이미지 url
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
