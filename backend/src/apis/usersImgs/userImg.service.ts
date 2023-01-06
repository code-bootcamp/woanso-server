import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserImg } from './entities/usersImg.entity';

@Injectable()
export class UserImgService {
  constructor(
    @InjectRepository(UserImg)
    protected readonly UserImgRepository: Repository<UserImg>,
  ) {}

  async findByUserId({ id }) {
    return await this.UserImgRepository.find({
      where: { id },
    });
  }

  async findAll() {
    return await this.UserImgRepository.find({});
  }

  async upload({ url, id }) {
    this.delete({ id });
    for (let i = 0; i < url.length; i++) {
      await this.UserImgRepository.save({
        url: url[i],
        isMain: i === 0 ? true : false,
        userId: { id },
      });
    }
    return await this.findByUserId({ id });
  }

  delete({ id }) {
    return this.UserImgRepository.delete({ id });
  }
}
