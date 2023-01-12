import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ComicImg } from './entities/comicsimg.entity';

@Injectable()
export class ComicImgService {
  constructor(
    @InjectRepository(ComicImg)
    protected readonly comicImgRepository: Repository<ComicImg>,
  ) {}

  async findBycomicId({ comicId }) {
    return await this.comicImgRepository.find({
      where: { comic: { comicId } },
    });
  }

  async findAll() {
    return await this.comicImgRepository.find({});
  }

  async upload({ url, comicId }) {
    this.delete({ comicId });
    for (let i = 0; i < url.length; i++) {
      await this.comicImgRepository.save({
        url: url[i],
        isMain: i === 0 ? true : false,
        comic: { comicId },
      });
    }
    return await this.findBycomicId({ comicId });
  }

  delete({ comicId }) {
    return this.comicImgRepository.delete({ comic: comicId });
  }
}
