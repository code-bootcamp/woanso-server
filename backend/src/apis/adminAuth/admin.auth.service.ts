import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IAdminAuthServiceGetAccessToken,
  IAdminAuthServiceSetRefreshToken,
} from './interfaces/admin-auth-service.interface';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly jwtService: JwtService, //
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

  getAccessToken({ admin }: IAdminAuthServiceGetAccessToken): string {
    return this.jwtService.sign(
      { email: admin.email, sub: admin.id },
      { secret: process.env.JWT_ADMIN_KEY, expiresIn: '1h' },
    );
  }
}
