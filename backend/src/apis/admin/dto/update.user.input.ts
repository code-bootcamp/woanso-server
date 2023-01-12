import { InputType, PartialType } from '@nestjs/graphql';
import { AdminUpdate } from './updateAdmin';

@InputType()
export class UpdateAdminInput extends PartialType(AdminUpdate) {}
