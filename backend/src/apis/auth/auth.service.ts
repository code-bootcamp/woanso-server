import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {
  IAuthServiceGetAccessToken,
  IAUthServiceSetRefreshToken,
} from './interfaces/auth-service.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  setRefreshToken({ user, res, req }: IAUthServiceSetRefreshToken): string {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_REFRESH_KEY, expiresIn: '2w' },
    );
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:5500',
      'https://examplezi.shop',
      'https://woanso.shop',
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    );
    //개발환경
    //res.setHeader('Set-Cookie', `refreshToken=${refreshToken};path=/;`);
    //배포환경
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; domain=.examplezi.shop; SameSite=None; Secure; httpOnly; path=/;`,
    );

    return refreshToken;
  }

  //개발환경
  // dklgjdkhdj
  //   res.setHeader('Set-Cookie', `refreshToken=${refreshToken};path=/;`);
  //   // 배포환경
  //   // res.setHeader('Set-Cookie', refreshToken=${refreshToken}; path=/; domain=.mybacksite.com; SameSite=None; Secure; httpOnly;)
  //   // res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com')
  // }

  async loginOAuth({ req, res }) {
    //프로필을 받아온 다음, 로그인 처리해야 하는 곳
    // 회원 조회(찾기)
    let user = await this.usersService.findOne({ email: req.user.email });
    // 회원가입이 안되어있다면 => 회원 등록(가입)
    if (!user) {
      user = await this.usersService.create({ ...req.user });
      //로그인
      this.setRefreshToken({ user, res });
      res.redirect('https://woanso.shop/join');
      //'http://localhost:5500/homework/main-project/frontend/login/index.html',
      // 프론트엔드 파일 합친 후, 수정하기
      //);
    } else {
      this.setRefreshToken({ user, res, req });
      res.redirect('https://woanso.shop');
    }
  }

  getAccessToken({ user }: IAuthServiceGetAccessToken): string {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_ACCESS_KEY, expiresIn: '1h' },
    ); // 중요한 정보 저장 x
  }
}
