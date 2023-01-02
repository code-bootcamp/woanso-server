import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUrlInput {
  @Field(() => [String])
  url: string[];

  @Field(() => Boolean)
  isMain: boolean;

  //   @Field(() => String)
  //   material: string;

  //   @Field(() => Int)
  //   delivery_fee: number;
}
// 이미지 담기
