import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Field(() => String)
  comicId: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  content: string;

  //@Field(() => Int)
  like: number;

  @Field(() => Float)
  rating: number;
}
