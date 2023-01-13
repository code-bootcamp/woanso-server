import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { BoardLikeService } from './boardLike.service';

@Resolver()
export class BoardLikeResolver {
  constructor(
    private readonly likeService: BoardLikeService, //
  ) {}

  //------------------**[좋아요]**------------------
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  likeBoard(
    @Args('id') id: string, //
    @Context() context: IContext,
  ) {
    const user = context.req.user.email;
    return this.likeService.like({ id, user });
  }
  //------------------**[싫어요]**------------------
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  dislikeBoard(
    @Args('id') id: string, //
    @Context() context: IContext,
  ) {
    const user = context.req.user.email;
    return this.likeService.dislike({ id, user });
  }
}
