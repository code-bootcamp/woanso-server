import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { CommentsService } from './comments.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { Comment } from './entities/comment.entity';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  //-------------------------*조회*----------------------------//

  @Query(() => [Comment])
  async fetchAllComments(
    @Args({ name: 'page', defaultValue: 1, nullable: true })
    page: number, //
    @Args({
      name: 'order',
      defaultValue: 'DESC',
      nullable: true,
    })
    order: string,
  ) {
    return this.commentsService.findAll({ page, order });
  }

  //-------------------------*아이디로 하나 조회*----------------------------//
  @Query(() => [Comment])
  fetchComments(
    @Args({ name: 'page', defaultValue: 1, nullable: true })
    page: number, //
    @Args({
      name: 'order',
      defaultValue: 'DESC',
      nullable: true,
    })
    order: string,
    @Args('boardId') id: string, // args 를 comicId
    //
  ): Promise<Comment[]> {
    return this.commentsService.findByComic({ page, order, id });
  }

  //-------------------------*생성*----------------------------//
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @Context() context: IContext,
  ): Promise<Comment> {
    return this.commentsService.create({ createCommentInput, context });
  }

  //-------------------------*삭제*----------------------------//
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteComment(
    @Args('ID') id: string, //
  ) {
    return this.commentsService.delete({ id });
  }
}
