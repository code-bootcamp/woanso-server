import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComicsResolver } from './comics.resolver';
import { ComicsService } from './comics.service';
import { Comic } from './entities/comic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comic]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
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
