import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String)
  content: string;

  @Field(() => String)
  boardId: string;

  @Field(() => String)
  userId: string;
}
