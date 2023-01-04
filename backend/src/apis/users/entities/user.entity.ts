import { Field, ObjectType, Int, registerEnumType } from '@nestjs/graphql';
import { UserAuthority } from 'src/apis/usersAuth/entities/user.auth.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// export enum USER_ROLE_ENUM {
//   Admin = 'ADMIN',
//   User = 'USER',
// }

export enum USER_INTEREST_ENUM {
  romance = '로맨스',
  drama = '드라마/일상',
  fantasy = '판타지',
  action = '액션',
  school = '학원',
  horror = '추리/공포',
}

// registerEnumType(USER_ROLE_ENUM, {
//   name: 'USER_ROLE_ENUM',
// });

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
  @Column({ type: 'enum', enum: USER_INTEREST_ENUM })
  interest: string;

  // @Field(() => USER_ROLE_ENUM)
  // @Column({ type: 'enum', enum: USER_ROLE_ENUM })
  // role: string;

  @Field(() => Int)
  @Column({ default: 3000 })
  balance: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserAuthority, (userAuthority) => userAuthority.user, {
    eager: true,
  })
  authorities?: any[];
}
