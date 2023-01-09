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
    private readonly elasticsearchService: ElasticsearchService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  //--------------------------------**[Sign Up]**--------------------------------
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

  //----------------------**[Find User by EMAIL]**----------------------
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchUser(
    @Args('email') email: string, //
  ): Promise<User> {
    return this.usersService.findOne({ email });
  }

  //----------------------**[Find Login User]**----------------------
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchUserLoggedIn(@Context() context: IContext) {
    console.log(context.req.user.email);
    return this.usersService.findLogin({ context });
  }

  //----------------------**[Find User email]**----------------------
  @Query(() => User)
  findEmail(@Args('phone') phone: string): Promise<User> {
    return this.usersService.findEmail({ phone });
  }

  //----------------------**[Update User info]**----------------------
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

  //----------------------**[Update Password]**----------------------
  @Mutation(() => String)
  async updatePassword(
    @Args('email') email: string,
    @Args('phone') phone: string,
    @Args('updateUserPwdInput') updateUserPwdInput: string,
  ) {
    const myToken = await this.cache.get(phone);
    if (!myToken) {
      console.log(myToken);
      throw new UnprocessableEntityException('인증 미실시');
    }

    const hashedPassword = await bcrypt.hash(updateUserPwdInput, 10);
    return await this.usersService.updatePassword({ email, hashedPassword });
  }

  //----------------------**[Delete user]**----------------------
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteUser(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<boolean> {
    return this.usersService.delete({ email, password });
  }

  //----------------------**[Auth user]**----------------------
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => String)
  authUser(
    @Context() context: IContext, //
  ): string {
    console.log(context.req.user);
    console.log(context);
    return '인가 성공';
  }

  //----------------------**[Get token]**----------------------
  @Mutation(() => String)
  async sendToken(@Args('phone') phone: string) {
    return await this.usersService.sendToken({ phone });
  }

  //----------------------**[Auth token]**----------------------
  @Mutation(() => String)
  async authToken(@Args('phone') phone: string, @Args('token') token: string) {
    return this.usersService.authToken({ phone, token });
  }

  //----------------------**[FOR ADMIN]**----------------------
  //----------------------**[FOR ADMIN]**----------------------
  //----------------------**[FOR ADMIN]**----------------------

  //----------------------**[SEARCH User for ADMIN]**----------------------
  @UseGuards(GqlAdminGuard)
  @Query(() => [User])
  async searchUsersForAdmin(
    @Args({
      name: 'search',
      nullable: true,
      description: '유저 닉네임으로 검색',
    })
    search: string, //
  ) {
    // REDIS 캐시 조회
    const userCache = await this.cache.get(`searchUsers:${search}`);
    if (userCache) return userCache;
    // 엘라스틱서치에서 조회
    const result = await this.elasticsearchService.search({
      index: 'user',
      query: { match: { nickname: search } },
    });
    // console.log(JSON.stringify(result, null, ' '));
    const users = result.hits.hits.map((el: any) => ({
      id: el._source.id,
      nickname: el._source.nickname,
      email: el._source.email,
    }));

    // console.log(users);

    // 엘라스틱 조회 결과가 있다면, 레디스에 결과 캐싱
    await this.cache.set(`searchUsers:${search}`, users);
    return users;
  }

  //----------------------**[Delete User For ADMIN]**----------------------
  @UseGuards(GqlAdminGuard)
  @Mutation(() => Boolean)
  blockUserForAdmin(@Args('email') email: string): Promise<boolean> {
    return this.usersService.deleteUser({ email });
  }

  //----------------------**[Restore User For ADMIN]**----------------------
  @UseGuards(GqlAdminGuard)
  @Mutation(() => Boolean)
  unblockUserForAdmin(
    @Args('email') email: string, //
  ): Promise<boolean> {
    return this.usersService.restoreUser({ email });
  }

  //----------------------**[Fetch Blocked User For ADMIN]**----------------------
  @UseGuards(GqlAdminGuard)
  @Query(() => [User])
  fetchBlockedUsersForAdmin(email): Promise<User[]> {
    return this.usersService.findBlocked(email);
  }

  //----------------------**[Find Users For ADMIN]**----------------------
  @UseGuards(GqlAdminGuard)
  @Query(() => [User])
  fetchUsersForAdmin(email): Promise<User[]> {
    return this.usersService.findAll(email);
  }

  //----------------------**[Find Login Users For ADMIN]**----------------------
  @UseGuards(GqlAdminGuard)
  @Query(() => User)
  fetchLoginUserForAdmin(@Context() context: IContext) {
    console.log(context.req.user.email);
    return this.usersService.findLogins({ context });
  }
}
