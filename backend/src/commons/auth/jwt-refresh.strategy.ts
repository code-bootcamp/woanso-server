// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-jwt';

// export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
//   constructor() {
//     super({
//       jwtFromRequest: (req) => {
//         console.log(req);
//         const cookie = req.headers.cookie;
//         const refreshToken = cookie.replace('refreshToken=', '');
//         return refreshToken;
//       },

//       secretOrKey: process.env.JWT_REFRESH_KEY,
//     });
//   }

//   validate(payload) {
//     console.log(payload);
//     return {
//       email: payload.email,
//       id: payload.sub,
//     };
//   }

//   //레디스에서 들고와서 있는지 없는지 확인
// }

//----------------------------------------------------------------

import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: (req) => {
        console.log(req);
        const cookie = req.headers.cookie;
        const refreshToken = cookie.replace('refreshToken=', '');
        return refreshToken;
      },

      secretOrKey: process.env.JWT_REFRESH_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    // console.log(payload);
    const refresh = req.headers.cookie.replace('refreshToken=', '');

    const result = await this.cacheManager.get(`refreshToken:${refresh}`);
    console.log(result);
    if (result) {
      throw new UnauthorizedException('로그아웃된 토큰입니다.');
    }

    return {
      email: payload.email,
      id: payload.sub,
      exp: payload.exp,
    };
  }
}
