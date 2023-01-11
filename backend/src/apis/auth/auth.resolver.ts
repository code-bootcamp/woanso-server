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
import { GqlAdminGuard } from '../../commons/auth/gql-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly usersService: UsersService, //
    private readonly authService: AuthService, //
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  //-----------------**[LOGIN normal]**------------------
  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ): Promise<string> {
    // 1. 이메일이 일치하는 유저를 DB에서 찾기
    const user = await this.usersService.findOne({ email });
    // 2. 일치하는 유저가 없으면, 에러 던지기
    if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');
    // 3. 일치하는 유저가 있지만 비밀번호가 틀렸다면
    const isAuth = await bcrypt.compare(password, user.password); // 해시된 패스워드(user.password)
    // console.log(isAuth);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');
    //password === user.password;

    // 4. refreshToken(=JWT)을 만들어서 프론트엔드 브라우저 쿠키에 저장해서 보내주기
    this.authService.setRefreshToken({
      user,
      res: context.res,
      req: context.req,
    });

    // 5. 일치하는 유저도 있고 비밀번호도 맞았다면
    // => accessToken(=JWT)을 만들어서 브라우저에 전달
    // console.log(context.req);
    return this.authService.getAccessToken({ user });
  }

  //-----------------**[Restore access token]**------------------
  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @Context() context: IContext, //
  ): string {
    // accessToken(=JWT)을 만들어서 브라우저에 전달하기
    // this.authService.setRefreshToken({
    //   user: context.req.user,
    //   req: context.req,
    //   res: context.res,
    // });
    return this.authService.getAccessToken({ user: context.req.user });
  }

  //-----------------**[Logout]**------------------
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(
    @Context() context: IContext, //any, // 왜 굳이 any로 받지? 타입체크 안하려고?
  ) {
    const access = context.req.headers.authorization.replace('Bearer ', '');

    const refresh = context.req.headers.cookie.replace('refreshToken=', '');

    try {
      const changedAcc = jwt.verify(access, process.env.JWT_ACCESS_KEY);
      const changedRef = jwt.verify(refresh, process.env.JWT_REFRESH_KEY);
      const time = new Date().getTime();
      const accessTtl = changedAcc['exp'] - Number(String(time).slice(0, -3));
      const refreshTtl = changedRef['exp'] - Number(String(time).slice(0, -3));

      //await this.cacheManager.set(`accessToken:${access}`, 'access', 3600);
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
