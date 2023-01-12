import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
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
  romance = 'romance',
  drama = 'drama',
  fantasy = 'fantasy',
  action = 'action',
  school = 'school',
  horror = 'horror',
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

  @CreateDateColumn()
  createdAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Field(() => String)
  @Column({ nullable: true })
  phone: string;

  @JoinColumn()
  @Field(() => UserImg, { nullable: true })
  @OneToOne(() => UserImg)
  userImg: UserImg;

  // @OneToMany(() => UserAuthority, (userAuthority) => userAuthority.user, {
  //   eager: true,
  // })
  // authorities?: any[];
}
