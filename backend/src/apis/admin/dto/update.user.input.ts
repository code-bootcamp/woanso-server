import { InputType, PartialType } from '@nestjs/graphql';
import { SignUpAdminInput } from './signup.input';

@InputType()
export class UpdateAdminInput extends PartialType(SignUpAdminInput) {}
