import { InputType, PartialType } from '@nestjs/graphql';
import { CreateComicInput } from './createComic.input';

@InputType()
export class UpdateComicInput extends PartialType(CreateComicInput) {}
