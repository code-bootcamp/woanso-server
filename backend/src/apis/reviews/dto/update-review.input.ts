import { InputType, PartialType } from '@nestjs/graphql';
import { CreateReviewInput } from './createReview.input';

@InputType()
export class UpdateReviewInput extends PartialType(CreateReviewInput) {}

//PickType(CreateProductInput, ['name', 'price']) => 고르기
//OmitType(CreateProductInput, ['name', 'price']) => 빼기
//PartialType(CreateProductInput) => 았/없 가능
