import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Comic } from 'src/apis/comics/entities/comic.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
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

  @Column({ default: 0 })
  @Field(() => Int)
  like: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Comic)
  @Field(() => Comic)
  comic: Comic;
}
