import { Module } from '@nestjs/common';
import { Review } from './entities/review.entity';
import { ReviewsResolver } from './reviews.resolver';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Comic } from '../comics/entities/comic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review, //
      User,
      Comic,
    ]),
  ],
  providers: [
    ReviewsResolver, //
    ReviewsService,
  ],
})
export class ReviewsModule {}
