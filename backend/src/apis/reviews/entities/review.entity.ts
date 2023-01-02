import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
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
  @Field(() => String)
  author: string;

  @Column()
  @Field(() => Int)
  rating: number;

  @Column()
  @Field(() => String)
  publisher: string;

  @Column()
  @Field(() => Int) // 별점을 줄 수 있도록 0.5 단위로 제한
  ratings: number;

  @Column()
  @Field(() => String) //string
  publicationDate: string;

  @Column()
  @Field(() => Int)
  totalBooks: number;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => String)
  ISBN: string;

  @Column()
  @Field(() => Boolean)
  isAvailable: boolean;
}
