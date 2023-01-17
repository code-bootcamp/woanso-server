import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateWishInput {
  @Field(() => String)
  comicId: string;

  @Field(() => String)
  userId: string;
}
