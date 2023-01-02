import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Comic } from 'src/apis/comics/entities/comic.entity';
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
export class Review {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  reviewId: string;

  @Column()
  @Field(() => String)
  content: string;

  @Column()
  @Field(() => Int)
  like: number;

  @Field(() => Int)
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @Field(() => Int)
  rating: number;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Comic)
  @Field(() => Comic)
  comic: Comic;
}
