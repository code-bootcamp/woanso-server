import { UseGuards } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';

import { CreateReviewInput } from './dto/createReview.input';

import { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

@Resolver()
export class ReviewsResolver {
  constructor(
    private readonly reviewsService: ReviewsService, // // private readonly reviewsRatingService: ReviewsRatingService, //
  ) {}

  @Query(() => [Review])
  async fetchReviews() {
    // return this.reviewsService.findAll();
    const result = [];
    const review = await this.reviewsService.findAll();
    review.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

    while (review.length > 0) {
      result.push(review.splice(0, 10));
    }

    return result;
  }

  @Query(() => Review)
  fetchReview(
    @Args('reviewId') reviewId: string, //
    // @Args('reviewRatingId') reviewRatingId: string, //
  ): Promise<Review> {
    return this.reviewsService.findOne({ reviewId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Review)
  createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
  ): Promise<Review> {
    return this.reviewsService.create({ createReviewInput });
  }

  //삭제
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteReview(@Args('reviewId', { type: () => ID }) reviewId: string) {
    return this.reviewsService.delete({ reviewId });
  }

  @Mutation(() => Boolean)
  restoreReview(@Args('reviewId', { type: () => ID }) reviewId: string) {
    return this.reviewsService.restore({ reviewId });
  }
}
