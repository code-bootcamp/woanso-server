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
import { GqlAdminGuard } from '../../commons/auth/gql-auth.guard';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    //private readonly elasticsearchService: ElasticsearchService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  //--------------------**[회원가입]**--------------------
  @Mutation(() => User)
  async signUp(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('nickname') nickname: string,
    @Args('phone') phone: string,
    @Args('interest') interest: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create({
      email,
      hashedPassword,
      nickname,
      phone,
      interest,
    });
  }

  //--------------------**[이메일로 유저찾기]**--------------------
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchUser(
    @Args('email') email: string, //
  ): Promise<User> {
    return this.usersService.findOne({ email });
  }

  //--------------------**[로그인한 유저찾기]**--------------------
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchUserLoggedIn(@Context() context: IContext) {
    console.log(context.req.user.email);
    return this.usersService.findLogin({ context });
  }

  //----------------------**[이메일찾기]**----------------------
  @Query(() => User)
  findEmail(@Args('phone') phone: string): Promise<User> {
    return this.usersService.findEmail({ phone });
  }

  //----------------------**[유저 정보 업데이트]**----------------------
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

  //--------------------**[비밀번호 재설정]**--------------------
  @Mutation(() => Boolean)
  async updatePassword(
    @Args('email') email: string,
    @Args('updateUserPwdInput') updateUserPwdInput: string,
  ) {
    const hashedPassword = await bcrypt.hash(updateUserPwdInput, 10);
    return await this.usersService.updatePassword({ email, hashedPassword });
  }

  //--------------------**[회원탈퇴]**--------------------
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteUser(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<boolean> {
    return this.usersService.delete({ email, password });
  }

  //--------------------**[인가]**--------------------
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => String)
  authUser(
    @Context() context: IContext, //
  ): string {
    console.log(context.req.user);
    console.log(context);
    return '인가 성공';
  }

  //--------------------**[휴대폰 SMS 토큰 발송]**--------------------
  @Mutation(() => String)
  async sendToken(@Args('phone') phone: string) {
    return await this.usersService.sendToken({ phone });
  }

  //--------------------**[휴대폰 SMS 토큰 인증]**--------------------
  async authToken(@Args('phone') phone: string, @Args('token') token: string) {
    return this.usersService.authToken({ phone, token });
  }

  //************************[어드민]************************

  //----------------------**[회원검색]**----------------------

  @UseGuards(GqlAdminGuard)
  @Query(() => [User])
  searchUserForAdmin(
    @Args('nickname') nickname: string,
    @Args('page') page: number,
  ) {
    return this.usersService.findUserForAdmin({ nickname, page });
  }

  // @UseGuards(GqlAdminGuard)
  // @Query(() => [User])
  // async searchUsersForAdmin(
  //   @Args({
  //     name: 'search',
  //     nullable: true,
  //     description: '유저 닉네임으로 검색',
  //   })
  //   search: string, //
  // ) {
  //   // REDIS 캐시 조회
  //   const userCache = await this.cache.get(`searchUsers:${search}`);
  //   if (userCache) return userCache;
  //   // 엘라스틱서치에서 조회
  //   const result = await this.elasticsearchService.search({
  //     index: 'user',
  //     query: { match: { nickname: search } },
  //   });
  //   // console.log(JSON.stringify(result, null, ' '));
  //   const users = result.hits.hits.map((el: any) => ({
  //     id: el._source.id,
  //     nickname: el._source.nickname,
  //     email: el._source.email,
  //   }));

  //   // console.log(users);

  //   // 엘라스틱 조회 결과가 있다면, 레디스에 결과 캐싱
  //   await this.cache.set(`searchUsers:${search}`, users);
  //   return users;
  // }

  //----------------------**[회원 활동 정지]**----------------------
  @UseGuards(GqlAdminGuard)
  @Mutation(() => Boolean)
  blockUserForAdmin(@Args('email') email: string): Promise<boolean> {
    return this.usersService.deleteUser({ email });
  }

  //----------------------**[회원 활동 정지 해제]**----------------------
  @UseGuards(GqlAdminGuard)
  @Mutation(() => Boolean)
  unblockUserForAdmin(
    @Args('email') email: string, //
  ): Promise<boolean> {
    return this.usersService.restoreUser({ email });
  }

  //----------------------**[활동 정지된 유저 조회]**----------------------
  // @UseGuards(GqlAdminGuard)
  // @Query(() => [User])
  // fetchBlockedUsersForAdmin(context): Promise<User[]> {
  //   console.log(context);
  //   return this.usersService.findBlocked(context);
  // }

  //----------------------**[모든 유저 조회하기]**----------------------
  @UseGuards(GqlAdminGuard)
  @Query(() => [User])
  fetchUsersForAdmin(
    @Args({ name: 'page', defaultValue: 1, nullable: true })
    page: number, //
    @Args({
      name: 'order',
      defaultValue: 'DESC',
      nullable: true,
    })
    order: string,
  ) {
    return this.usersService.findAll({ page, order });
  }

  //----------------------**[로그인한 모든 유저 조회하기]**----------------------
  // @UseGuards(GqlAdminGuard)
  // @Query(() => [User])
  // fetchLoginUserForAdmin(
  //   @Context() context: IContext,
  //   @Args('page') page: number,
  // ) {
  //   return this.usersService.findLogins({ context, page });
  // }
}
