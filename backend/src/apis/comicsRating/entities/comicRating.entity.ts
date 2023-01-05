import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
