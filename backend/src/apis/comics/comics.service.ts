import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateComicInput } from './dto/createComic.input';
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

  //대여가능여부
  // findOne1(
  //   { isAvailable }: IComicsServicecheckOne, //: Promise<Comic>
  // ) {
  //   if (stock > 0) {
  //     return '대여 가능';
  //   } else {
  //     return '대여 불가능';
  //   }
  //   return this.comicsRepository.findOne({ where: { isAvailable } });
  //}

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
