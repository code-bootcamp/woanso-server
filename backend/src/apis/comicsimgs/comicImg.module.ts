import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComicImgResolver } from './comicImg.resolver';
import { ComicImgService } from './comicImg.service';
import { ComicImg } from './entities/comicsimg.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ComicImg, //
    ]),
  ],

  providers: [
    ComicImgResolver, //
    ComicImgService,
  ],
})
export class ComicImgModule {}
