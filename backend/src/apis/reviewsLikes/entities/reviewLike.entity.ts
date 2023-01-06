// import { Field, Int, ObjectType } from '@nestjs/graphql';
// import { ReviewBoard } from 'src/apis/reviewBoards/entities/reviewBoard.entity';
// import { User } from 'src/apis/users/entities/user.entity';
// import {
//   Column,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   OneToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';

// @Entity()
// @ObjectType()
// export class ReviewLike {
//   @PrimaryGeneratedColumn('uuid')
//   @Field(() => String)
//   id: string;

//   @ManyToOne(() => ReviewBoard)
//   @Field(() => ReviewBoard)
//   reviewBoard: ReviewBoard;

//   @ManyToOne(() => User)
//   @Field(() => User)
//   user: User;
// }
