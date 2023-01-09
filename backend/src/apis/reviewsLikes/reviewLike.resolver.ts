import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';

import { ReviewLikeService } from './reviewLike.service';

@Resolver()
export class ReviewLikeResolver {
  constructor(
    private readonly reviewLikeService: ReviewLikeService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  likeReviewBoard(
    @Args('reviewId') reviewId: string, //
    @Context() context: IContext,
  ) {
    const user = context.req.user.email;
    return this.reviewLikeService.like({ reviewId, user });
  }
}
