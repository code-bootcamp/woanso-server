import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateComicInput {
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
  pubisher: string;

  @Field(() => Int) // 별점을 줄 수 있도록 0.5 단위로 제한
  ratings: number;

  // @Field(() => String) //string
  // publicationDate: string;

  @Field(() => Int)
  totalBooks: number;

  @Field(() => String)
  description: string;

  @Field(() => String)
  ISBN: string;

  @Field(() => Boolean)
  isAvailable: boolean;

  // @Field(() => Int)
  // stock: number;

  @Field(() => [String])
  url: string[];
}
