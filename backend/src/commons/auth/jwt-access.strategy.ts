import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const access = req.headers.authorization.replace('Bearer ', '');

    const result = await this.cacheManager.get(`accessToken:${access}`);

    if (result === 'access') {
      throw new UnauthorizedException('이미 로그아웃된 토큰입니다.');
    }

    return {
      email: payload.email,
      id: payload.sub,
      exp: payload.exp,
    };
  }
}
