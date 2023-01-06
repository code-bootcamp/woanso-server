import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import {
  ICommentsServiceCreate,
  ICommentsServiceFindOne,
} from './interfaces/comments-service.interface';
import { User } from 'src/apis/users/entities/user.entity';

@Injectable()
export class CommentsService {
  //DI
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,

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

    // const product = await this.productsRepository.findOne({
    //   where: { product_id: productId },
    // });

    // if (!product)
    //   throw new UnprocessableEntityException('구매한 제품 정보를 입력해주세요');

    // const user = await this.usersRepository.findOne({
    //   where: { id: userId },
    // });

    // if (!user)
    //   throw new UnprocessableEntityException('구매자 정보를 입력해주세요');

    //유저 다중으로 안해놓으면 상품이 바뀌어도 유저id로 한번밖에 글 작성을 못함
    // const userDuplicate = await this.commentsRepository.findOne({
    //   where: { user: { id: userId } },
    // });

    // if (userDuplicate) {
    //   throw new UnprocessableEntityException(
    //     user.name +
    //       '님은 이미 구매평을 작성하셨습니다. 1인당 1개의 구매평만 작성 가능합니다',
    //   );
    // }

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

    const result = await this.commentsRepository.softDelete({
      id,
    });
    return result.affected ? true : false;
  }
}
