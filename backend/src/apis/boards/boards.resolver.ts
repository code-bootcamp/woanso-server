import { Args, Mutation, Query, Resolver, Context } from '@nestjs/graphql';
import { BoardsService } from './boards.service';
import { UpdateBoardInput } from './dto/update-board.input';
import { Board } from './entities/board.entity';
import { GqlAuthAccessGuard } from '../../commons/auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateBoardInput } from './dto/create-board.input';

@Resolver()
export class BoardsResolver {
  constructor(
    private readonly boardsService: BoardsService, //
  ) {}

  ////----------------------**[Fetch Boards]**----------------------
  @Query(() => [Board])
  fetchBoards(
    @Args({ name: 'page', defaultValue: 1, nullable: true })
    page: number, //
    @Args({
      name: 'order',
      defaultValue: 'DESC',
      nullable: true,
    })
    order: string,
  ) {
    //게시글 전체 불러 오기
    return this.boardsService.find({ page, order });
  }

  //----------------------**[Fetch Board By User]**----------------------
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Board])
  fetchBoardsByUser(
    @Context() context: any, //
  ) {
    //유저가 쓴 게시글 목록 불러오기
    const email = context.req.user.email;
    return this.boardsService.userFind({ email });
  }

  //----------------------**[Fetch Board Detail]**----------------------
  @Query(() => Board)
  fetchBoard(
    @Args('id') id: string, //
  ) {
    //게시글내용 상세 불러오기
    return this.boardsService.findOne({ id });
  }

  //----------------------**[Create Board]**----------------------
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  createBoard(
    @Context() context: any, //
    @Args('createBoardInput') createBoardInput: CreateBoardInput, //
  ) {
    //게시글 생성
    const email = context.req.user.email;
    return this.boardsService.create({ email, createBoardInput });
  }

  //----------------------**[Update Board]**----------------------
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  updateBoard(
    @Context() context: any, //
    @Args('id') id: string,
    @Args('updateBoardInput') updateBoardInput: UpdateBoardInput,
  ) {
    //게시글 내용 수정
    const email = context.req.user.email;
    return this.boardsService.update({ id, email, updateBoardInput });
  }

  //----------------------**[Delete Board]**----------------------
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteBoard(
    @Args('id') id: string, //
  ) {
    return this.boardsService.delete({ id });
  }
}
