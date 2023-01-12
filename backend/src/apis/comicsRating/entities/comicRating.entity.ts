import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Comic } from 'src/apis/comics/entities/comic.entity';

import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ComicRating {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  comicRatingId: string;

  @Column({ default: 0 })
  @Field(() => Int)
  totalRating: number;

  @Column({
    // default: 0.0,
    nullable: true,
    type: 'float',
    precision: 4,
    scale: 2,
  })
  @Field(() => Float)
  comicRating: number;

  //  comicId: string;

  @JoinColumn()
  @OneToOne(() => Comic, { cascade: true })
  @Field(() => Comic)
  comic: Comic;
}
