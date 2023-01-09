import {
  CACHE_MANAGER,
  Inject,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { AdminAuthService } from './admin.auth.service';
import { IContext } from 'src/commons/types/context';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';
import { AdminService } from '../admin/admin.service';
import {
  GqlAdminGuard,
  GqlAuthRefreshGuard,
} from '../../commons/auth/gql-auth.guard';

@Resolver()
export class AdminAuthResolver {
  constructor(
    private readonly adminService: AdminService, //
    private readonly adminAuthService: AdminAuthService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  //----------------------**[ADMIN login]**-----------------------------
  @Mutation(() => String)
  async adminLogin(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ): Promise<string> {
    const admin = await this.adminService.findOne({ email });

    if (!admin)
      throw new UnprocessableEntityException(
        '이메일 혹은 비밀번호를 확인해주세요.',
      );

    const isAuth = await bcrypt.compare(password, admin.password);
    if (!isAuth)
      throw new UnprocessableEntityException(
        '이메일 혹은 비밀번호를 확인해주세요.',
      );

    this.adminAuthService.setRefreshToken({
      admin,
      res: context.res,
      req: context.req,
    });
    return this.adminAuthService.getAccessToken({ admin });
  }

  //----------------------**[Access token for ADMIN]**-----------------------------
  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessTokenForAdmin(
    @Context() context: IContext, //
  ): string {
    return this.adminAuthService.getAccessToken({
      admin: context.req.user,
    });
  }

  //----------------------**[ADMIN logout]**-----------------------------
  @UseGuards(GqlAdminGuard)
  @Mutation(() => String)
  async logoutForAdmin(
    @Context() context: IContext, //
  ) {
    const refresh = context.req.headers.cookie.replace('refreshToken=', '');
    const access = context.req.headers.authorization.replace('Bearer ', '');

    try {
      const changedAcc = jwt.verify(access, process.env.JWT_ADMIN_KEY);
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

    return '로그아웃에 성공하였습니다.';
  }
}
