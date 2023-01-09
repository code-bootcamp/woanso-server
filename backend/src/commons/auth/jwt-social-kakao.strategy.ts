import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      //clientSecret: process.env.JWT_KAKAO_SECRET, //어드민
      callbackURL: 'https://woanso.shop/login/kakao',
      //scope: ["email", "profile"],
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
