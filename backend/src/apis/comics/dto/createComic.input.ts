import { Field, InputType, Int } from '@nestjs/graphql';
import { COMIC_CATEGORY_ENUM } from '../entities/comic.entity';

@InputType()
export class CreateComicInput {
  reviewId?: string;

  userId?: string;

  @Field(() => String)
  title: string;

  @Field(() => Int)
  deliveryFee: number;

  @Field(() => Int)
  rentalFee: number;

  @Field(() => String)
  author: string;

  @Field(() => String)
  illustrator: string;

  @Field(() => String)
  publisher: string;

  // @Field(() => Float) // 별점을 줄 수 있도록 0.5 단위로 제한
  // ratings: number;

  @Field(() => Int)
  totalBooks: number;

  @Field(() => String)
  description: string;

  @Field(() => String)
  ISBN: string;

  @Field(() => Boolean)
  isAvailable?: boolean;

  @Field(() => Int)
  stock: number;

  @Field(() => [String])
  url: string[];

  @Field(() => COMIC_CATEGORY_ENUM)
  category: string;
}
