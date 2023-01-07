import { Field, ObjectType, Int, registerEnumType } from '@nestjs/graphql';
import { UserImg } from 'src/apis/usersImgs/entities/usersImg.entity';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum USER_INTEREST_ENUM {
  romance = '로맨스',
  drama = '드라마/일상',
  fantasy = '판타지',
  action = '액션',
  school = '학원',
  horror = '추리/공포',
}

registerEnumType(USER_INTEREST_ENUM, {
  name: 'USER_INTEREST_ENUM',
});

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id: string;

  @Field(() => String)
  @Column({ default: '', nullable: true })
  nickname: string;

  @Field(() => String)
  @Column({ nullable: true })
  email: string;

  // @Field(() => String)
  @Column({ nullable: true })
  password: string;

  @Field(() => String)
  @Column({ nullable: true })
  phone: string;

  @Field(() => USER_INTEREST_ENUM)
  @Column({ type: 'enum', enum: USER_INTEREST_ENUM, nullable: true })
  interest: string;

  @Field(() => Int)
  @Column({ default: 3000, nullable: true })
  balance: number;

  @CreateDateColumn()
  createdAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @JoinColumn()
  @Field(() => UserImg, { nullable: true })
  @OneToOne(() => UserImg)
  userImg: UserImg;

  // @OneToMany(() => UserAuthority, (userAuthority) => userAuthority.user, {
  //   eager: true,
  // })
  // authorities?: any[];
}
