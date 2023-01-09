import { Field, ObjectType } from '@nestjs/graphql';
import { Comic } from 'src/apis/comics/entities/comic.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class ComicImg {
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

  // @OneToOne((type) => Comic, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  // @JoinColumn()
  // comic: Comic;

  // @JoinTable()
  @JoinColumn()
  @OneToOne(() => Comic)
  @Field(() => Comic)
  comic: Comic;

  @DeleteDateColumn()
  deletedAt: Date;
}
