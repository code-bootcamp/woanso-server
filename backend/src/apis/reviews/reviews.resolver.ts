import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateReviewInput } from './dto/createReview.input';

import { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

@Resolver()
export class ReviewsResolver {
  constructor(
    private readonly reviewsService: ReviewsService, //
  ) {}

  @Query(() => [Review])
  fetchReviews() {
    return this.reviewsService.findAll();
  }

  @Query(() => Review)
  fetchReview(
    @Args('reviewId') reviewId: string, //
  ): Promise<Review> {
    return this.reviewsService.findOne({ reviewId });
  }

  @Mutation(() => Review)
  createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
  ): Promise<Review> {
    return this.reviewsService.create({ createReviewInput });
  }

  //삭제
  @Mutation(() => Boolean)
  deleteComic(@Args('reviewId', { type: () => ID }) reviewId: string) {
    return this.reviewsService.delete({ reviewId });
  }

  @Mutation(() => Boolean)
  restoreComic(@Args('reviewId', { type: () => ID }) reviewId: string) {
    return this.reviewsService.restore({ reviewId });
  }
}
