import { InputType, PartialType } from '@nestjs/graphql';
import { UpdateUserClass } from './updateUser';

@InputType()
export class UpdateUserInput extends PartialType(UpdateUserClass) {}
