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
  fetchComments(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @Query(() => Comment)
  fetchComment(@Args('ID') id: string): Promise<Comment> {
    return this.commentsService.findOne({ id });
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
