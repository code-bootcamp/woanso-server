import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Comic } from 'src/apis/comics/entities/comic.entity';

import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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
    nullable: true,
    type: 'float',
    precision: 4,
    scale: 2,
  })
  @Field(() => Float)
  comicRating: number;

  @OneToOne(() => Comic, { onDelete: 'CASCADE' })
  //@Field(() => Comic)
  comic: Comic;
}
