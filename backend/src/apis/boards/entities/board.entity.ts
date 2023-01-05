import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BoardImg } from 'src/apis/boardsImgs/entities/boardsimg.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  content: string;

  @Column()
  @Field(() => Int)
  like?: number;

  @Column()
  @Field(() => Int)
  dislike?: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @JoinColumn()
  @OneToMany(() => BoardImg, (boardImg) => boardImg.board)
  @Field(() => [BoardImg])
  boardImg: BoardImg[];

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
