import { Field, ObjectType } from '@nestjs/graphql';
import { Comic } from 'src/apis/comics/entities/comic.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class ComicImg {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ default: '' })
  @Field(() => String, { nullable: true })
  url: string;

  @Column()
  @Field(() => Boolean)
  isMain: boolean;

  @ManyToOne(() => Comic, { onDelete: 'CASCADE' })
  @Field(() => Comic)
  comic: Comic;

  @DeleteDateColumn()
  deletedAt: Date;
}
