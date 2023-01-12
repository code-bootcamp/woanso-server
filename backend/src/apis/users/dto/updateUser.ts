import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserClass {
  @Field(() => String)
  email: string;

  @Field(() => String)
  nickname?: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  interest: string;
}
