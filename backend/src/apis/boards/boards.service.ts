import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Board } from './entities/board.entity';
import { BoardImg } from 'src/apis/boardsImgs/entities/boardsimg.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BoardImg)
    private readonly boardImgRepository: Repository<BoardImg>,
  ) {}

  //----------------------**[Fetch Boards]**----------------------
  find({ page, order }) {
    return this.boardRepository.find({
      relations: ['user', 'boardImg'],
      skip: (page - 1) * 6,
      take: 6,
      order: { createdAt: order },
    });
  }

  //----------------------**[Fetch Board By User]**----------------------
  async userFind({ email }) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return this.boardRepository.find({
      where: { user: { id: user.id } },
      relations: ['boardImg', 'user'],
    });
  }
  //----------------------**[Fetch Board Detail]**----------------------
  findOne({ id }) {
    return this.boardRepository.findOne({
      where: { id },
      relations: ['boardImg', 'user'],
    });
  }
  //----------------------**[Create Board]**----------------------
  async create({ email, createBoardInput }) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    const { boardImg, ...boardData } = createBoardInput;
    const board: any = await this.boardRepository.save({
      ...boardData,
      user,
    });
    for (let i = 0; i < boardImg.length; i++) {
      const url = boardImg[i];
      await this.boardImgRepository.save({
        board,
        url,
      });
    }
    return board;
  }

  //----------------------**[Update Board]**----------------------
  async update({ email, updateBoardInput, id }) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    const beforeBoard = await this.boardRepository.findOne({
      where: {
        user: { id: user.id },
        id,
      },
      relations: ['boardImg'],
    });

    if (!beforeBoard) {
      throw new ConflictException('잘못된 시도입니다.');
    }

    //기존 이미지 지우기
    const boardImg = beforeBoard.boardImg;
    for (let i = 0; i < boardImg.length; i++) {
      const boardImgID = boardImg[i].boardImgID;
      this.boardImgRepository.delete({
        boardImgID,
      });
    }

    const board = await this.boardRepository.save({
      ...beforeBoard,
      ...updateBoardInput,
      user,
    });

    const newBoardImg = board.boardImg;
    for (let i = 0; i < newBoardImg.length; i++) {
      const url = newBoardImg[i];
      this.boardImgRepository.save({
        board,
        url,
      });
    }
    return board;
  }
  //----------------------**[Delete Board]**----------------------
  async delete({ id }) {
    // const user = await this.userRepository.findOne({
    //   where: { id },
    // });
    // const board = await this.boardRepository.findOne({
    //   where: {
    //     id,
    //     user: { id: user.id },
    //   },
    // });
    // if (!board) {
    //   throw new ConflictException('잘못된 시도입니다.');
    // }

    const result = await this.boardRepository.softDelete({
      id,
    });
    this.boardImgRepository.softDelete({ board: { id } });
    return result.affected ? true : false;
  }
}
