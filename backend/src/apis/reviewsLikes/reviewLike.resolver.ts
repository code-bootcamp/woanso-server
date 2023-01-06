// import { UseGuards } from '@nestjs/common';
// import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
// import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
// import { IContext } from 'src/commons/type/context';
// import { Like } from './entities/like.entity';
// import { LikeService } from './like.service';

// @Resolver()
// export class ReviewLikeResolver {
//   constructor(
//     private readonly likeService: LikeService, //
//   ) {}

//   //   @Query(() => [Like])
//   //   fetchLikeReviewBoard(
//   //     @Args('userId') userId: string, //
//   //     @Args('reviewBoardId') reviewBoardId: string,
//   //   ) {
//   //     return;
//   //   }

//   @UseGuards(GqlAuthAccessGuard)
//   @Mutation(() => String)
//   likeReviewBoard(
//     @Args('reviewBoardId') reviewBoardId: string, //
//     @Context() context: IContext,
//   ) {
//     const user = context.req.user.email;
//     return this.likeService.like({ reviewBoardId, user });
//   }
// }
