import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Field(() => String)
  comicId: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  content: string;

  @Field(() => Int)
  like: number;

  // @Field()
  // createdAt: Date; 굳이 디비에 저장할 필요없음. 자동 생성

  @Field(() => Int)
  rating: number;
}
