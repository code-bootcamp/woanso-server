import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignUpInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  nickname?: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  interest: string;
}
