import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComicImg } from '../comicsImgs/entities/comicsimg.entity';
import { ComicRating } from '../comicsRating/entities/comicRating.entity';
import { ComicsResolver } from './comics.resolver';
import { ComicsService } from './comics.service';
import { Comic } from './entities/comic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comic, ComicRating, ComicImg])],
  providers: [ComicsService, ComicsResolver],
  exports: [ComicsService],
})
export class ComicsModule {}
