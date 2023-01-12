import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BoardImg } from 'src/apis/boardsImgs/entities/boardsimg.entity';
import { Comment } from 'src/apis/comments/entities/comment.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

  @Column({ nullable: true })
  @Field(() => String)
  content: string;

  @Column({ nullable: true, default: 0 })
  @Field(() => Int)
  like?: number;

  @Column({ nullable: true, default: 0 })
  @Field(() => Int)
  dislike?: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BoardImg, (boardImg) => boardImg.board, {
    onDelete: 'CASCADE',
  })
  @Field(() => [BoardImg])
  boardImg?: BoardImg[];

  @OneToMany(() => Comment, (comment) => comment.board, { onDelete: 'CASCADE' })
  @Field(() => [Comment])
  comment?: Comment[];

  @ManyToOne(() => User)
  @Field(() => User)
  user?: User;
}
