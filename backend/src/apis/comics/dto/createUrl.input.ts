import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUrlInput {
  @Field(() => [String])
  url: string[];

  @Field(() => Boolean)
  isMain: boolean;
}
// 이미지 담기
