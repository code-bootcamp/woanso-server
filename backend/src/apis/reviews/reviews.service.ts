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

  //전체조회
  findAll(): Promise<Review[]> {
    return this.reviewRepository.find({
      //relations: ['user', 'comic', 'reviewRating'],
      relations: ['user', 'comic', 'comicRating'],
    });
  }

  findOne({ reviewId }: IReviewsServiceFindOne): Promise<Review> {
    return this.reviewRepository.findOne({
      where: { reviewId },
      relations: ['user', 'comic', 'reviewRating'],
    });
  }

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
  //---------------------------------------------------------------//
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

  //삭제
  async delete({ reviewId }) {
    const result = await this.reviewRepository.softDelete({ reviewId });

    return result.affected ? true : false;
  }

  async restore({ reviewId }) {
    const result = await this.reviewRepository.restore({ reviewId });

    return result.affected ? true : false;
  }
}
