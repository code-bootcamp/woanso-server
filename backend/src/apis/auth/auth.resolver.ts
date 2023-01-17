import {
  CACHE_MANAGER,
  Inject,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { IContext } from 'src/commons/types/context';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import { Cache } from 'cache-manager';
import * as jwt from 'jsonwebtoken';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly usersService: UsersService, //
    private readonly authService: AuthService, //
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  //-----------------**[회원 로그인]**------------------
  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ): Promise<string> {
    const user = await this.usersService.findOne({ email });

    if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

    const isAuth = await bcrypt.compare(password, user.password); // 해시된 패스워드(user.password)

    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    this.authService.setRefreshToken({
      user,
      res: context.res,
      req: context.req,
    });

    return this.authService.getAccessToken({ user });
  }

  //-----------------**[회원 엑세스 토큰]**------------------
  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @Context() context: IContext, //
  ): string {
    return this.authService.getAccessToken({ user: context.req.user });
  }

  //-----------------**[회원 로그아웃]**------------------
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(@Context() context: IContext) {
    const access = context.req.headers.authorization.replace('Bearer ', '');

    const refresh = context.req.headers.cookie.replace('refreshToken=', '');

    try {
      const changedAcc = jwt.verify(access, process.env.JWT_ACCESS_KEY);
      const changedRef = jwt.verify(refresh, process.env.JWT_REFRESH_KEY);
      const time = new Date().getTime();
      const accessTtl = changedAcc['exp'] - Number(String(time).slice(0, -3));
      const refreshTtl = changedRef['exp'] - Number(String(time).slice(0, -3));

      await this.cacheManager.set(`accessToken:${access}`, 'access', accessTtl);
      await this.cacheManager.set(
        `refreshToken:${refresh}`,
        'refresh',
        refreshTtl,
      );
    } catch {
      throw new UnauthorizedException('에러발생');
    }

    return '로그아웃에 성공했습니다.';
  }
}
