import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Board } from 'src/apis/boards/entities/board.entity';
import { BoardLike } from './entities/boardLike.entity';
import { BoardDislike } from './entities/boardDislike.entity';

@Injectable()
export class BoardLikeService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(BoardLike)
    private readonly likeRepository: Repository<BoardLike>,

    @InjectRepository(BoardDislike)
    private readonly dislikeRepository: Repository<BoardDislike>,
  ) {}
  //------------------------**[LIKE]**-------------------------------
  async like({ id, user }) {
    //유저
    const findUser = await this.userRepository.findOne({
      where: { email: user },
    });

    //게시글
    const board = await this.boardRepository.findOne({
      where: { id: id },
    });

    const findLike = await this.likeRepository.findOne({
      where: {
        board: { id: id },
        user: { id: findUser.id },
      },
      relations: ['board', 'user'],
    });

    //좋아요가 있다면 삭제
    if (findLike) {
      await this.likeRepository.delete({
        board: { id: id },
        user: { id: findUser.id },
      });
      await this.boardRepository.update({ id: id }, { like: board.like - 1 });
      return '좋아요 취소!';
    } else {
      await this.likeRepository.save({
        board: { id: id },
        user: { id: findUser.id },
      });

      //좋아요가 없다면
      await this.boardRepository.update({ id: id }, { like: board.like + 1 });
      return '좋아요!';
    }
  }

  //------------------------**[DISLIKE]**-------------------------------
  async dislike({ id, user }) {
    //유저
    const findUser = await this.userRepository.findOne({
      where: { email: user },
    });

    //게시글
    const board = await this.boardRepository.findOne({
      where: { id: id },
    });

    const findDisLike = await this.dislikeRepository.findOne({
      where: {
        board: { id: id },
        user: { id: findUser.id },
      },
      relations: ['board', 'user'],
    });

    //싫어요가 있다면 삭제
    if (findDisLike) {
      await this.dislikeRepository.delete({
        board: { id: id },
        user: { id: findUser.id },
      });
      await this.boardRepository.update(
        { id: id },
        { dislike: board.dislike - 1 },
      );
      return '싫어요 취소!';
    } else {
      await this.dislikeRepository.save({
        board: { id: id },
        user: { id: findUser.id },
      });

      //싫어요가 없다면
      await this.boardRepository.update(
        { id: id },
        { dislike: board.dislike + 1 },
      );
      return '싫어요!';
    }
  }
}
