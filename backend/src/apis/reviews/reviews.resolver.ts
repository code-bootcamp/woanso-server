import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CreateReviewInput } from './dto/createReview.input';
import { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

@Resolver()
export class ReviewsResolver {
  constructor(
    private readonly reviewsService: ReviewsService, //
  ) {}

  //------------------**[모든 리뷰 조회]**------------------
  @Query(() => [Review])
  async fetchReviews(
    @Args({ name: 'page', defaultValue: 1, nullable: true })
    page: number, //
    @Args({
      name: 'order',
      defaultValue: 'DESC',
      nullable: true,
    })
    order: string,
  ) {
    return this.reviewsService.findAll({ page, order });
  }

  //------------------**[리뷰 조회]**------------------
  @Query(() => [Review])
  fetchReview(
    @Args('comicId') comicId: string, //
  ): Promise<Review[]> {
    return this.reviewsService.findOne({ comicId });
  }

  //------------------**[리뷰 생성]**------------------
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Review)
  createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
  ): Promise<Review> {
    return this.reviewsService.create({ createReviewInput });
  }

  //------------------**[리뷰 삭제]**------------------
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteReview(
    @Args('reviewId', { type: () => ID }) reviewId: string,
    @Args('comicId', { type: () => ID }) comicId: string,
  ) {
    console.log('resolver');
    return this.reviewsService.delete({ reviewId, comicId });
  }
}
