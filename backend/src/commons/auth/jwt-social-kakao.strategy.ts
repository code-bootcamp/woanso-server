import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,

      callbackURL: 'https://woanso.shop/login/kakao',
    });
  }

  validate(accessToken, refreshToken, profile) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);

    return {
      //프로필 내 필요한 정보들(회원가입 시 필요한 정보들)
      name: profile.displayName,
      email: profile._json.kakao_account.email,
      password: profile.id,
      age: 0,
    };
  }
}
