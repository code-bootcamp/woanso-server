import { Module } from '@nestjs/common';
import { Review } from './entities/review.entity';
import { ReviewsResolver } from './reviews.resolver';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Comic } from '../comics/entities/comic.entity';
import { ComicRating } from '../comicsRating/entities/comicRating.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review, //
      User,
      Comic,
      ComicRating,
    ]),
  ],
  providers: [
    ReviewsResolver, //
    ReviewsService,
  ],
})
export class ReviewsModule {}
