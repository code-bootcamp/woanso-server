// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { Review } from '../reviews/entities/review.entity';
// import { User } from '../users/entities/user.entity';
// import { reviewLike } from './entities/reviewLike.entity';

// @Injectable()
// export class ReviewLikeService {
//   constructor(
//     @InjectRepository(Review)
//     private readonly reviewRepository: Repository<Review>,

//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,

//     @InjectRepository(reviewLike)
//     private readonly likeRepository: Repository<reviewLike>,
//   ) {}

//   //

//   //
//   async like({ reviewBoardId, user }) {
//     const findUser = await this.userRepository.findOne({
//       where: { email: user },
//     });

//     const findLike = await this.reviewLikeRepository.findOne({
//       where: {
//         review: { reviewId },
//         user: { id: findUser.id },
//       },
//       relations: ['reviewBoard', 'user'],
//     });
//     console.log(findLike);

//     if (findLike) {
//       await this.likeRepository.delete({
//         reviewBoard: { id: reviewBoardId },
//         user: { id: findUser.id },
//       });

//       const reviewBoard = await this.reviewBoardRepository.findOne({
//         where: { id: reviewBoardId },
//       });

//       await this.reviewBoardRepository.update(
//         { id: reviewBoardId },
//         { like: reviewBoard.like - 1 },
//       );

//       return '좋아요 취소';
//     } else {
//       await this.likeRepository.save({
//         reviewBoard: { id: reviewBoardId },
//         user: { id: findUser.id },
//       });

//       const reviewBoard = await this.reviewBoardRepository.findOne({
//         where: { id: reviewBoardId },
//       });

//       await this.reviewBoardRepository.update(
//         { id: reviewBoardId },
//         { like: reviewBoard.like + 1 },
//       );

//       return '좋아요 추가';
//     }
//   }
// }
