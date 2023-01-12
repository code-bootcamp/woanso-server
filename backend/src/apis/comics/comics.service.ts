import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComicImg } from 'src/apis/comicsImgs/entities/comicsImg.entity';
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

  //검색기능
  // async findWithTitle({ title }) {
  //   const result = await this.comicsRepository.find();

  //   return result.filter((el) => el.title.includes(title));
  // }

  //전체조회
  findAll(): Promise<Comic[]> {
    //페이지네이션? 24개씩
    return this.comicsRepository.find({ relations: ['comicRating'] });
  }

  findOne({ comicId }: IComicsServiceFindOne): Promise<Comic> {
    return this.comicsRepository.findOne({
      where: { comicId },
      relations: ['comicRating'],
    });
  }

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

  //대여가능 , 대여불가 수량 조회
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
  //삭제
  async delete({ comicId }) {
    const result = await this.comicsRepository.softDelete({ comicId });

    return result.affected ? true : false;
  }

  async restore({ comicId }) {
    const result = await this.comicsRepository.restore({ comicId });

    return result.affected ? true : false;
  }
}
