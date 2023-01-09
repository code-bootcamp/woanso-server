import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import {
  IAdminAuthServiceGetAccessToken,
  IAdminAuthServiceSetRefreshToken,
} from './interfaces/admin-auth-service.interface';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly adminService: AdminService,
  ) {}

  setRefreshToken({
    admin,
    res,
    req,
  }: IAdminAuthServiceSetRefreshToken): string {
    const refreshToken = this.jwtService.sign(
      { email: admin.email, sub: admin.id },
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
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; domain=.examplezi.shop; SameSite=None; Secure; httpOnly; path=/;`,
    );

    return refreshToken;
  }

  async loginOAuth({ req, res }) {
    //프로필을 받아온 다음, 로그인 처리해야 하는 곳
    // 회원 조회(찾기)
    let admin = await this.adminService.findOne({ email: req.admin.email });
    // 회원가입이 안되어있다면 => 회원 등록(가입)
    if (!admin) {
      admin = await this.adminService.create({ ...req.admin });
      //로그인
      this.setRefreshToken({ admin, res });
      res.redirect('https://woanso.shop/join');
    } else {
      this.setRefreshToken({ admin, res, req });
      res.redirect('https://woanso.shop');
    }
  }

  getAccessToken({ admin }: IAdminAuthServiceGetAccessToken): string {
    return this.jwtService.sign(
      { email: admin.email, sub: admin.id },
      { secret: process.env.JWT_ADMIN_KEY, expiresIn: '1h' },
    );
  }
}
