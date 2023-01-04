import { UpdateReviewInput } from '../dto/update-review.input';
import { Review } from '../entities/review.entity';
import { CreateReviewInput } from '../dto/createReview.input';

export interface IReviewsServiceCreate {
  createReviewInput: CreateReviewInput;
}

export interface IReviewsServiceFindOne {
  reviewId: string;
}

export interface IReviewsServiceUpdate {
  review: Review;
  updateReviewInput: UpdateReviewInput;
}

// export interface IReviewsServiceCheckSoldout {
//   review: Review;
// }

export interface IReviewsServiceDelete {
  reviewId: string;
}
