import { InputType, PartialType } from '@nestjs/graphql';
import { SignUpInput } from './signup.input';

@InputType()
export class UpdateUserInput extends PartialType(SignUpInput) {}
