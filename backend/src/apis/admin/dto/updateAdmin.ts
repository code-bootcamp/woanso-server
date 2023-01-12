import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AdminUpdate {
  @Field(() => String)
  email: string;

  @Field(() => String)
  nickname: string;

  @Field(() => String)
  phone: string;
}
