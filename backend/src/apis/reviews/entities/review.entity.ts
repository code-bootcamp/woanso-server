import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Comic } from 'src/apis/comics/entities/comic.entity';
import { ComicRating } from 'src/apis/comicsRating/entities/comicRating.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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
  @Field(() => String, { nullable: true })
  reviewId: string;

  @Column()
  @Field(() => String)
  content: string;

  @Column({ default: 0 })
  @Field(() => Int)
  like: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  @Field(() => Float)
  rating: number;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Comic)
  @Field(() => Comic)
  comic: Comic;

  @JoinColumn()
  @OneToOne(() => ComicRating)
  @Field(() => ComicRating)
  comicRating: ComicRating;
}
