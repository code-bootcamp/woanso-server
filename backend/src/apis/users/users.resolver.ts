import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from './dto/update.user.input';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import {
  CACHE_MANAGER,
  Inject,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { IContext } from 'src/commons/types/context';
import { Cache } from 'cache-manager';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly elasticsearchService: ElasticsearchService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  //Sign up for USER
  @Mutation(() => User)
  async signUp(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('nickname') nickname: string,
    @Args('phone') phone: string,
    @Args('interest') interest: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'USER';

    // 엘라스틱서치 등록 임시 //
    this.elasticsearchService.create({
      id: 'id',
      index: 'user',
      document: {
        email,
        password,
        nickname,
        phone,
        interest,
      },
    });
    return this.usersService.create({
      email,
      hashedPassword,
      nickname,
      phone,
      interest,
      role,
    });
  }

  //Sign up for ADMIN user
  @Mutation(() => User)
  async signUpAdmin(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('phone') phone?: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'ADMIN';

    return this.usersService.createAdmin({
      email,
      hashedPassword,
      role,
      phone,
    });
  }

  //Find one user(by email)
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchUser(
    @Args('email') email: string, //
  ): Promise<User> {
    return this.usersService.findOne({ email });
  }

  //Find all user
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [User])
  fetchUsers(email): Promise<User[]> {
    return this.usersService.findAll(email);
  }

  //Find User email (by phone)
  @Query(() => User)
  findEmail(@Args('phone') phone: string): Promise<User> {
    return this.usersService.findEmail({ phone });
  }

  //Update user
  @Mutation(() => User)
  async updateUser(
    @Args('email') email: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const user = await this.usersService.findOne({ email });

    return this.usersService.update({
      user,
      updateUserInput,
    });
  }

  //Update password
  @Mutation(() => String)
  async updatePassword(
    @Args('email') email: string,
    @Args('phone') phone: string,
    @Args('newPassword') password: string,
  ) {
    const myToken = await this.cache.get(phone);
    if (!myToken) {
      console.log(myToken);
      throw new UnprocessableEntityException('인증 미실시');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.usersService.updatePassword({ email, hashedPassword });
  }

  //Delete
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteUser(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<boolean> {
    return this.usersService.delete({ email, password });
  }

  //Guard
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => String)
  authUser(
    @Context() context: IContext, //
  ): string {
    console.log(context.req.user);
    console.log(context);
    return '인가 성공';
  }

  //Get Token
  @Mutation(() => String)
  async sendToken(@Args('phone') phone: string) {
    return await this.usersService.sendToken({ phone });
  }

  //Auth token
  @Mutation(() => String)
  async authToken(@Args('phone') phone: string, @Args('token') token: string) {
    return this.usersService.authToken({ phone, token });
  }
}
