import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserClass {
  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  nickname?: string;

  @Field(() => String, { nullable: true })
  phone: string;

  @Field(() => String, { nullable: true })
  interest: string;

  @Field(() => String, { nullable: true })
  thumbnail: string;
}
