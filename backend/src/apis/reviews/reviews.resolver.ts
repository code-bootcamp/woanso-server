import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateReviewInput } from './dto/createReview.input';
import { UpdateReviewInput } from './dto/update-review.input';
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
    // @Args('writer') writer: string,
    // @Args('title') title: string,
    // @Args({ name: 'contents', nullable: true }) contents: string,
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
  ): Promise<Review> {
    return this.reviewsService.create({ createReviewInput });
  }

  //수정
  @Mutation(() => Review)
  async updateComic(
    @Args('reviewId') reviewId: string,
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput, //
  ): Promise<Review> {
    const review = await this.reviewsService.findOne({ reviewId });

    return this.reviewsService.update({ review, updateReviewInput });
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
