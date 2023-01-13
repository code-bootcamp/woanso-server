import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { threadId } from 'worker_threads';
import { Comic } from '../comics/entities/comic.entity';
import { ComicRating } from '../comicsRating/entities/comicRating.entity';

import { User } from '../users/entities/user.entity';
import { Review } from './entities/review.entity';
import {
  IReviewsServiceFindOne,
  IReviewsServiceCreate,
  IReviewsServiceDelete,
  IReviewsServiceUpdate,
} from './interfaces/reviews-service.interface';
@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Comic)
    private readonly comicRepository: Repository<Comic>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ComicRating)
    private readonly comicRatingRepository: Repository<ComicRating>,
  ) {}

  //------------------**[리뷰 조회]**------------------
  findAll({ page, order }): Promise<Review[]> {
    return this.reviewRepository.find({
      relations: ['user', 'comic'],
      skip: (page - 1) * 4,
      take: 4,
      order: { createdAt: order },
    });
  }

  findOne({ comicId }: IReviewsServiceFindOne): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { comic: { comicId } },
      relations: ['user', 'comic'],
    });
  }
  //------------------**[리뷰 생성]**------------------
  async create({ createReviewInput }: IReviewsServiceCreate): Promise<Review> {
    const { comicId, userId, ...review } = createReviewInput;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    const resultComic = await this.reviewRepository.find({
      where: {
        comic: { comicId },
      },
      relations: ['user', 'comic'],
    });
    const result2 = await this.comicRepository.findOne({
      where: {
        comicId,
      },
      relations: ['comicRating'],
    });

    if (resultComic.length === 0) {
      await this.comicRatingRepository.update(
        { comicRatingId: result2.comicRating.comicRatingId },
        { totalRating: result2.comicRating.totalRating + review.rating },
      );
      const result3 = await this.comicRepository.findOne({
        where: {
          comicId,
        },
        relations: ['comicRating'],
      });
      await this.comicRatingRepository.update(
        { comicRatingId: result2.comicRating.comicRatingId },
        { comicRating: result3.comicRating.totalRating / 1 },
      );
    } else {
      await this.comicRatingRepository.update(
        { comicRatingId: result2.comicRating.comicRatingId },
        {
          totalRating: result2.comicRating.totalRating + review.rating,
        },
      );
      const result3 = await this.comicRepository.findOne({
        where: {
          comicId,
        },
        relations: ['comicRating'],
      });
      await this.comicRatingRepository.update(
        { comicRatingId: result2.comicRating.comicRatingId },
        {
          comicRating:
            result3.comicRating.totalRating / (resultComic.length + 1),
        },
      );
    }

    const result = this.reviewRepository.save({
      comic: {
        ...result2,
      },
      user: {
        ...user,
      },
      ...review,
    });

    return result;
  }

  //---------------좋아요 함수 -------------------------
  // async create2(createReviewLikeInput: CreateReviewLikeInput): {
  //   const { data, review } = createReviewLikeInput;

  //   const reviewData = await getConnection()
  //     .createQueryBuilder()
  //     .select('review')
  //     .from(Review, 'review')
  //     .where('review.id = :id', { id: review })
  //     .getOne();

  //   try {
  //     if (!reviewData)
  //       throw new NotFoundException('다이어리가 존재하지 않습니다.');

  //     // 좋아요 눌렀는지 확인하기
  //     const alreadyLiked = await this.reviewRepository.findOne({
  //       where: { reviewId: review, data },
  //     });

  //     if (alreadyLiked) {
  //       // 좋아요 기록 삭제
  //       await this.reviewRepository.delete({ id: alreadyLiked.id });

  //       // 좋아요 카운트 -1
  //       await getConnection()
  //         .createQueryBuilder()
  //         .update(Review)
  //         .set({ likeCount: () => `likeCount-1` })
  //         .where('id = :id', { id: review })
  //         .execute();

  //       // 다이어리 정보 리턴
  //       return reviewData;
  //     }

  //     // 좋아요 기록 생성
  //     await this.reviewRepository.save({
  //       reviewId: review,
  //       data,
  //     });

  //     // 다이어리 좋아요 +1
  //     await getConnection()
  //       .createQueryBuilder()
  //       .update(Review)
  //       .set({ likeCount: () => `likeCount+1` })
  //       .where('id = :id', { id: review })
  //       .execute();

  //     // 다이어리 정보 리턴
  //     return reviewData;
  //   } catch (e) {
  //     if (e.status === 404) {
  //       return e;
  //     }
  //     throw new Error('Review Like Create Server Error');
  //   }
  // }

  //------------------**[리뷰 업데이트]**------------------
  update({
    review,
    updateReviewInput,
  }: // createUrlInput,
  IReviewsServiceUpdate): Promise<Review> {
    return this.reviewRepository.save({
      ...review, //
      ...updateReviewInput,
    });
  }

  //------------------**[리뷰 삭제]**------------------
  async delete({ reviewId, comicId }): Promise<any> {
    const relatedReview = await this.reviewRepository.findOne({
      where: { reviewId },
    });

    const numberOfComic = await this.reviewRepository.find({
      where: {
        comic: { comicId },
      },
      relations: ['comic'],
    });

    const relatedComic = await this.comicRepository.findOne({
      where: { comicId },
      relations: ['comicRating'],
    });

    await this.comicRatingRepository.update(
      { comicRatingId: relatedComic.comicRating.comicRatingId },
      {
        totalRating:
          relatedComic.comicRating.totalRating - relatedReview.rating,
      },
    );

    const relatedComic2 = await this.comicRepository.findOne({
      where: { comicId },
      relations: ['comicRating'],
    });

    await this.comicRatingRepository.update(
      { comicRatingId: relatedComic2.comicRating.comicRatingId },
      {
        comicRating:
          relatedComic2.comicRating.totalRating / numberOfComic.length,
      },
    );

    const result = await this.reviewRepository.delete({ reviewId });
    return result.affected ? true : false;
  }
}
