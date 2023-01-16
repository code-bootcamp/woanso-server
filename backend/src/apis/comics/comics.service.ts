import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ComicImg } from '../comicsImgs/entities/comicsimg.entity';
import { ComicRating } from '../comicsRating/entities/comicRating.entity';
import { Review } from '../reviews/entities/review.entity';
import { User } from '../users/entities/user.entity';

import { Comic } from './entities/comic.entity';
import {
  IComicsServiceCreate,
  IComicsServiceFindOne,
  IComicsServiceUpdate,
} from './interfaces/comics-service.interface';

@Injectable()
export class ComicsService {
  constructor(
    @InjectRepository(Comic)
    private readonly comicsRepository: Repository<Comic>,
    @InjectRepository(ComicRating)
    private readonly comicsRatingRepository: Repository<ComicRating>,
    @InjectRepository(ComicImg)
    private readonly comicImgRepository: Repository<ComicImg>,
  ) {}

  //------------------**[만화 검색]**------------------
  async findWithTitle({ title, page }) {
    const result = await this.comicsRepository.find({
      where: { title: Like(`%${title}%`) },
      take: 24,
      skip: (page - 1) * 24,
      relations: ['comicRating', 'comicImg'],
    });
    return result;
  }

  //------------------**[모든 만화 조회]**------------------
  findAll({}): Promise<Comic[]> {
    //페이지네이션? 24개씩
    return this.comicsRepository.find({
      relations: ['comicRating', 'comicImg'],
    });
  }
  //------------------**[만화 조회]**------------------
  findOne({ comicId }: IComicsServiceFindOne): Promise<Comic> {
    return this.comicsRepository.findOne({
      where: { comicId },
      relations: ['comicRating', 'comicImg'],
    });
  }

  //------------------**[만화 등록]**------------------
  async create({ createComicInput }: IComicsServiceCreate): Promise<Comic> {
    const { url, ...comic } = createComicInput;
    // const user = await this.userRepository.findOne({
    //   where: {
    //     id: userId,
    //   },
    // });
    // const resultReview = await this.comicsRepository.find({
    //   where: {
    //     review: { reviewId },
    //   },
    //   relations: ['user', 'review'],
    // });
    // const result2 = await this.reviewRepository.findOne({
    //   where: {
    //     reviewId,
    //   },
    // });
    // console.log(result2);
    // if (resultReview.length === 0) {
    // }
    // 어떻게 별점 평균으로 저장하지?
    const result2 = await this.comicsRatingRepository.save({
      comicRating: 0,
      totalRating: 0,
    });
    const result = await this.comicsRepository.save({
      comicRating: {
        ...result2,
      },
      ...createComicInput,
    });

    await Promise.all(
      url.map((el, i) =>
        this.comicImgRepository.save({
          url: el,
          isMain: i === 0 ? true : false,
          comic: {
            ...result,
          },
        }),
      ),
    );
    return result;
  }

  //대여가능수량
  // findOne1(
  //   { isAvailable }: IComicsServicecheckOne, //: Promise<Comic>
  // ) {
  //   return this.comicsRepository.findOne({ where: { isAvailable } });
  // }

  //------------------**[대여 가능/불가능 만화 수량 학인]**------------------
  async findAll1() {
    const result = await this.comicsRepository.find();
    let availableCount = 0;
    let nonAvailableCount = 0;
    for (let i = 0; i < result.length; i++) {
      if (result[i].isAvailable === true) {
        //대여가능하다면
        availableCount++;
      } else {
        //대여불가능한것
        nonAvailableCount++;
      }
    }
    return [availableCount, nonAvailableCount];
  }

  update({
    comic,
    updateComicInput,
  }: //
  IComicsServiceUpdate): Promise<Comic> {
    return this.comicsRepository.save({
      ...comic, //
      ...updateComicInput,
    });
  }

  //------------------**[만화 삭제]**------------------
  async delete({ comicId }) {
    const resultComic = await this.comicsRepository.findOne({
      where: {
        comicId,
      },
      relations: ['comicRating'],
    });
    const result = await this.comicsRepository.delete({ comicId });

    await this.comicsRatingRepository.delete({
      comicRatingId: resultComic.comicRating.comicRatingId,
    });

    return result.affected ? true : false;
  }

  //------------------**[만화 복구]**------------------
  async restore({ comicId }) {
    const result = await this.comicsRepository.restore({ comicId });

    return result.affected ? true : false;
  }
}
