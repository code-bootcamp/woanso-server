import { InputType, PartialType } from '@nestjs/graphql';
import { CreateComicInput } from './createComic.input';

@InputType()
export class UpdateComicInput extends PartialType(CreateComicInput) {
  //   name: string;
  //   description: string;
  //   price: number;
}

//PickType(CreateProductInput, ['name', 'price']) => 고르기
//OmitType(CreateProductInput, ['name', 'price']) => 빼기
//PartialType(CreateProductInput) => 았/없 가능
