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
  publisher: string;

  @Field(() => Int)
  totalBooks: number;

  @Field(() => String)
  description: string;

  @Field(() => String)
  ISBN: string;

  @Field(() => Int)
  stock: number;

  @Field(() => [String], { nullable: true })
  url: string[];

  @Field(() => String)
  category: string;
}
