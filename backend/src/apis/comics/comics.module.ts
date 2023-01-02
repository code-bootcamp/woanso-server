import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComicsResolver } from './comics.resolver';
import { ComicsService } from './comics.service';
import { Comic } from './entities/comic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comic])],
  providers: [ComicsService, ComicsResolver],
  exports: [ComicsService],
})

// @Module({
//   imports: [TypeOrmModule.forFeature([Comic])],
//   providers: [
//     ComicsResolver, //
//     ComicsService,
//   ],
// })
export class ComicsModule {}
