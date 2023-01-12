import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BoardDislike } from 'src/apis/boardLikes/entities/boardDislike.entity';
import { BoardLike } from 'src/apis/boardLikes/entities/boardLike.entity';
import { Board } from 'src/apis/boards/entities/board.entity';
import { Comment } from 'src/apis/comments/entities/comment.entity';
import { PointTransaction } from 'src/apis/payments/entities/payment.entity';
import { Review } from 'src/apis/reviews/entities/review.entity';
import { ReviewLike } from 'src/apis/reviewsLikes/entities/reviewLike.entity';
import { Wishlist } from 'src/apis/wishlists/entities/wishlish.entity';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum USER_INTEREST_ENUM {
  romance = 'romance',
  drama = 'drama',
  fantasy = 'fantasy',
  action = 'action',
  school = 'school',
  horror = 'horror',
}

registerEnumType(USER_INTEREST_ENUM, {
  name: 'USER_INTEREST_ENUM',
});

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id: string;

  @Field(() => String)
  @Column({ default: '', nullable: true })
  nickname: string;

  @Field(() => String)
  @Column({ nullable: true })
  email: string;

  // @Field(() => String)
  @Column({ nullable: true })
  password: string;

  @Field(() => String)
  @Column({ nullable: true })
  phone: string;

  @Field(() => USER_INTEREST_ENUM)
  @Column({ type: 'enum', enum: USER_INTEREST_ENUM, nullable: true })
  interest: string;

  @CreateDateColumn()
  createdAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Field(() => String)
  @Column({ nullable: true, default: '' })
  thumbnail: string;

  ///---------------------------------------
  @OneToMany(() => Comment, (comment) => comment.user, { onDelete: 'CASCADE' })
  @Field(() => [Comment])
  comment: Comment[];

  @OneToMany(() => Review, (review) => review.user, { onDelete: 'CASCADE' })
  @Field(() => [Review])
  review: Review[];

  @OneToMany(() => ReviewLike, (reviewLike) => reviewLike.user, {
    onDelete: 'CASCADE',
  })
  @Field(() => [ReviewLike])
  reviewLike: ReviewLike[];

  @OneToMany(() => BoardDislike, (boardDislike) => boardDislike.user, {
    onDelete: 'CASCADE',
  })
  @Field(() => [BoardDislike])
  boardDislike: BoardDislike[];

  @OneToMany(() => BoardLike, (boardLike) => boardLike.user, {
    onDelete: 'CASCADE',
  })
  @Field(() => [BoardLike])
  boardlLike: BoardLike[];

  @OneToMany(() => Board, (board) => board.user, { onDelete: 'CASCADE' })
  @Field(() => [Board])
  board: Board[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user, {
    onDelete: 'CASCADE',
  })
  @Field(() => [Wishlist])
  wishlist: Wishlist[];

  @OneToMany(
    () => PointTransaction,
    (pointTransaction) => pointTransaction.user,
  )
  @Field(() => [PointTransaction])
  pointTransaction: PointTransaction[];

  // @JoinColumn()
  // @Field(() => UserImg, { nullable: true })
  // @OneToOne(() => UserImg)
  // userImg: UserImg;

  // @OneToMany(() => UserAuthority, (userAuthority) => userAuthority.user, {
  //   eager: true,
  // })
  // authorities?: any[];
}
