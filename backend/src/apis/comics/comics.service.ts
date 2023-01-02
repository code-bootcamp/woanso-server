import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
  ) {}

  //검색기능
  // async findWithTitle({ title }) {
  //   const result = await this.comicsRepository.find();

  //   return result.filter((el) => el.title.includes(title));
  // }

  //전체조회
  findAll(): Promise<Comic[]> {
    return this.comicsRepository.find();
  }

  findOne({ comicId }: IComicsServiceFindOne): Promise<Comic> {
    return this.comicsRepository.findOne({ where: { comicId } });
  }

  create({ createComicInput }: IComicsServiceCreate): Promise<Comic> {
    const result = this.comicsRepository.save({ ...createComicInput });

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
        availableCount++;
      } else {
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
