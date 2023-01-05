import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateReviewInput } from './dto/createReview.input';

import { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

@Resolver()
export class ReviewsResolver {
  constructor(
    private readonly reviewsService: ReviewsService, // // private readonly reviewsRatingService: ReviewsRatingService, //
  ) {}

  @Query(() => [Review])
  fetchReviews() {
    return this.reviewsService.findAll();
  }

  @Query(() => Review)
  fetchReview(
    @Args('reviewId') reviewId: string, //
    // @Args('reviewRatingId') reviewRatingId: string, //
  ): Promise<Review> {
    return this.reviewsService.findOne({ reviewId });
  }

  @Mutation(() => Review)
  createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
  ): Promise<Review> {
    return this.reviewsService.create({ createReviewInput });
  }
  // 좋아요
  // @Mutation(() => Int)
  // createlikes(
  //   @Args('createReviewLikeInput') createReviewLikeInput: CreateReviewLikeInput,
  // ) {
  //   return this.reviewsService.create2({ createReviewLikeInput });
  // }
  //삭제
  @Mutation(() => Boolean)
  deleteReview(@Args('reviewId', { type: () => ID }) reviewId: string) {
    return this.reviewsService.delete({ reviewId });
  }

  @Mutation(() => Boolean)
  restoreReview(@Args('reviewId', { type: () => ID }) reviewId: string) {
    return this.reviewsService.restore({ reviewId });
  }
}
