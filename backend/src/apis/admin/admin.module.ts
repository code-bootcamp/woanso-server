import { Module } from '@nestjs/common';
import { Admin } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comic } from '../comics/entities/comic.entity';
import { JwtAccessStrategy } from '../../commons/auth/jwt-access.strategy';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Comic]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],

  providers: [
    JwtAccessStrategy,
    AdminResolver, //
    AdminService,
  ],
})
export class AdminModule {}
