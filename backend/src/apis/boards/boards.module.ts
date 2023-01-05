import { Module } from '@nestjs/common';
import { BoardsResolver } from './boards.resolver';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from 'src/apis/boards/entities/board.entity';
import { User } from '../users/entities/user.entity';
import { BoardImg } from 'src/apis/boardsImgs/entities/boardsimg.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, User, BoardImg])],

  providers: [
    BoardsResolver, //
    BoardsService,
  ],
})
export class BoardsModule {}
