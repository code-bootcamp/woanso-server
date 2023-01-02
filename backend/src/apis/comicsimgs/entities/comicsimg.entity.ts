import { Field, ObjectType } from '@nestjs/graphql';
import { Comic } from 'src/apis/comics/entities/comic.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  url: string;

  @Column()
  @Field(() => Boolean)
  isMain: boolean;

  // @ManyToOne(() => Comic, (comic) => comic.image)
  // @Field(() => Comic)
  // comic: Comic;
}
