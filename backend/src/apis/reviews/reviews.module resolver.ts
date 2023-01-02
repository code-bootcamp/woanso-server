// import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// import { BoardsService } from './boards.service';
// import { CreateBoardInput } from './dto/create-board.input';
// import { Board } from './entities/board.entity';
// import { Review } from './entities/review.entity';
// import { ReviewsService } from './reviews.module service';

// @Resolver()
// export class ReviewsResolver {
//   constructor(
//     private readonly reviewsService: ReviewsService, //
//   ) {}

//   @Query(() => [Review], { nullable: true })
//   fetchBoards(): Board[] {
//     return this.reviewsService.findAll();
//   }

//   @Mutation(() => String)
//   createBoard(
//     // @Args('writer') writer: string,
//     // @Args('title') title: string,
//     // @Args({ name: 'contents', nullable: true }) contents: string,
//     @Args('createFReviewInput') createBoardInput: CreateBoardInput,
//   ): string {
//     return this.reviewsService.create({ creatReviewInput });
//   }
// }

// // 타입이 자동으로 만들어짐
// // Query: {
// //     fetchBoards: String
// // }
