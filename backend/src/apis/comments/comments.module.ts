import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { Comment } from './entities/comment.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Board } from 'src/apis/boards/entities/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Board, User])],
  providers: [CommentsResolver, CommentsService],
})
export class CommentsModule {}
