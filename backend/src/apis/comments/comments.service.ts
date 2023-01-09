import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import {
  ICommentsServiceCreate,
  ICommentsServiceFindOne,
} from './interfaces/comments-service.interface';
import { User } from 'src/apis/users/entities/user.entity';
import { Board } from 'src/apis/boards/entities/board.entity';

@Injectable()
export class CommentsService {
  //DI
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,

    @InjectRepository(Board)
    private readonly boardsRepository: Repository<Board>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  //-------------------------**[코멘트 조회]**-------------------------
  findAll(): Promise<Comment[]> {
    return this.commentsRepository.find({
      relations: ['user'],
    });
  }

  findOne({ id }: ICommentsServiceFindOne): Promise<Comment> {
    return this.commentsRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
  }

  async findAllWithDelete(): Promise<Comment[]> {
    return this.commentsRepository.createQueryBuilder().withDeleted().getMany();
  }

  //-------------------------**[코멘트 작성]**-------------------------
  async create({
    createCommentInput,
  }: ICommentsServiceCreate): Promise<Comment> {
    const { boardId, userId } = createCommentInput;
    const result = await this.commentsRepository.save({
      ...createCommentInput,
      board: { id: boardId },
      user: { id: userId },
    });

    return result;
  }

  //-------------------------**[삭제]**-------------------------
  async delete({ id }) {
    await this.commentsRepository.save({
      id,
      isDeleted: true,
    });
    const result = await this.commentsRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}