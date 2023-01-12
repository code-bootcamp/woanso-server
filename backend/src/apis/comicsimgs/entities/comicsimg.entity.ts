import { Field, ObjectType } from '@nestjs/graphql';
import { Comic } from 'src/apis/comics/entities/comic.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
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

  // @ManyToOne(() => Comic, (comic) => comic.image)
  // @Field(() => Comic)
  // comic: Comic;

  // @OneToOne((type) => Comic, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  // @JoinColumn()
  // comic: Comic;

  // @JoinTable()
  // @JoinColumn()
  // @OneToOne(() => Comic)
  // @Field(() => Comic)
  // comic: Comic;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Comic, (comic) => comic.comicImg)
  @Field(() => Comic)
  comic: Comic;
}
