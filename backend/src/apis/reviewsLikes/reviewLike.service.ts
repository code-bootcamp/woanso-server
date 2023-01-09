import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Review } from '../reviews/entities/review.entity';
import { User } from '../users/entities/user.entity';

import { ReviewLike } from './entities/reviewLike.entity';

@Injectable()
export class ReviewLikeService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(ReviewLike)
    private readonly reviewLikeRepository: Repository<ReviewLike>,
  ) {}

  //

  //
  async like({ reviewId, user }) {
    const findUser = await this.userRepository.findOne({
      where: { email: user },
    });

    const findLike = await this.reviewLikeRepository.findOne({
      where: {
        review: { reviewId },
        user: { id: findUser.id },
      },
      relations: ['review', 'user'],
    });
    console.log(findLike);

    if (findLike) {
      await this.reviewLikeRepository.delete({
        review: { reviewId },
        user: { id: findUser.id },
      });

      const reviewBoard = await this.reviewRepository.findOne({
        where: { reviewId },
      });

      await this.reviewRepository.update(
        { reviewId },
        { like: reviewBoard.like - 1 },
      );

      return '좋아요 취소';
    } else {
      await this.reviewLikeRepository.save({
        reviewBoard: { id: reviewId },
        user: { id: findUser.id },
      });

      const reviewBoard = await this.reviewRepository.findOne({
        where: { reviewId },
      });

      await this.reviewRepository.update(
        { reviewId },
        { like: reviewBoard.like + 1 },
      );

      return '좋아요 추가';
    }
  }
}
