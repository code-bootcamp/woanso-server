import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comic } from '../comics/entities/comic.entity';
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
  ) {}

  //전체조회
  findAll(): Promise<Review[]> {
    return this.reviewRepository.find();
  }

  findOne({ reviewId }: IReviewsServiceFindOne): Promise<Review> {
    return this.reviewRepository.findOne({ where: { reviewId } });
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
    });
    console.log(result2);
    if (resultComic.length === 0) {
      await this.comicRepository.update(
        {
          comicId,
        },
        {
          rating: (result2.rating + review.rating) / 1,
        },
      );
    } else {
      await this.comicRepository.update(
        {
          comicId,
        },
        {
          rating: (result2.rating + review.rating) / (resultComic.length + 1),
        },
      );
    }

    // const result3 = await this.comicRepository.findOne({
    //   where: {
    //     comicId,
    //   },
    // });

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

  // const result = this.reviewRepository.save({
  //   ...review, //수정 후 수정되지 않은 다른 결과값까지 모두 받고 싶을 때 사용
  //   ...updateReviewInput,
  // });
  // return result;
}
