import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';

export class JwtAdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ADMIN_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const access = req.headers.authorization.replace('Bearer ', '');
    const result = await this.cache.get(`access_token:${access}`);

    if (result === 'accessToken') {
      throw new UnauthorizedException('로그아웃 되었습니다.');
    }

    return {
      email: payload.email,
      id: payload.sub,
      exp: payload.exp,
    };
  }
}
