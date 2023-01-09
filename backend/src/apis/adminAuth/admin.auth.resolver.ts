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
import { GqlAdminGuard } from '../../commons/auth/gql-auth.guard';

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
  @UseGuards(GqlAdminGuard)
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
    const refresh_token = context.req.headers.cookie.replace(
      'refreshToken=',
      '',
    );
    const access_token = context.req.headers.authorization.replace(
      'Bearer ',
      '',
    );
    console.log(refresh_token);

    try {
      const decoded = jwt.verify(access_token, process.env.JWT_ACCESS_KEY);
      await this.cacheManager.set(
        `access_token:${access_token}`,
        'accessToken',
        context.req.user.exp,
      );
      const decodedR = jwt.verify(refresh_token, process.env.JWT_REFRESH_KEY);

      await this.cacheManager.set(
        `refresh_token:${refresh_token}`,
        'refreshToken',
        context.req.user.exp,
      );
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    return '로그아웃에 성공하였습니다.';
  }
}
