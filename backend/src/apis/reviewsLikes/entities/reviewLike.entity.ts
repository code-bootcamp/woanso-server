import { Field, ObjectType } from '@nestjs/graphql';
import { Review } from 'src/apis/reviews/entities/review.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ReviewLike {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  reviewLikeId: string;

  @ManyToOne(() => Review, { cascade: true })
  @Field(() => Review)
  review: Review;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;
}
