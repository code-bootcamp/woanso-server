import { ObjectType, Field } from '@nestjs/graphql';
import { Comic } from 'src/apis/comics/entities/comic.entity';
import { User } from 'src/apis/users/entities/user.entity';
//import { Diary } from 'src/apis/diary/entities/diary.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
//@Index(['fkDiaryId', 'data'], { unique: true })
export class ReviewLike {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  reviewLikeId: string;

  @Column()
  @Field(() => String)
  count: string;

  //   @ManyToOne((type) => Diary)
  //   @JoinColumn({ name: 'fkDiaryId' })
  //   diary: Diary;

  //   @Column('timestamptz')
  //   @CreateDateColumn()
  //   createAt: Date;

  //   @Column('timestamptz')
  //   @UpdateDateColumn()
  //   updateAt: Date;
}
