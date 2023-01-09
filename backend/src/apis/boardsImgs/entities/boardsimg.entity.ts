import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/boards/entities/board.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class BoardImg {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  boardImgID: string;

  @Column({ default: '' })
  @Field(() => String, { nullable: true })
  url: string;

  @ManyToOne(() => Board, (board) => board.boardImg)
  @Field(() => Board)
  board: Board;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
