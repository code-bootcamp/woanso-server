import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { BoardLike } from './entities/boardLike.entity';
import { Board } from 'src/apis/boards/entities/board.entity';
import { BoardLikeService } from './boardLike.service';
import { BoardLikeResolver } from './boardLike.resolver';
import { BoardDislike } from './entities/boardDislike.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardLike, BoardDislike, User, Board])],

  providers: [
    BoardLikeResolver, //
    BoardLikeService,
  ],
})
export class BoardLikeModule {}
