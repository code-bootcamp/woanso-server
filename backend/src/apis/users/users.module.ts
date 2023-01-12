import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
//import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // ElasticsearchModule.register({
    //   node: 'https://elasticsearch:9200',
    // }),
  ],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
