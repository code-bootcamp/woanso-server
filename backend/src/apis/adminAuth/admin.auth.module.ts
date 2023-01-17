import { Module } from '@nestjs/common';
import { AdminAuthResolver } from './admin.auth.resolver';
import { AdminAuthService } from './admin.auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
import { Admin } from '../admin/entities/admin.entity';
import { AdminService } from '../admin/admin.service';
import { JwtAdminStrategy } from 'src/commons/auth/jwt-admin.strategy';

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([
      Admin, //
    ]),
  ],
  providers: [
    JwtRefreshStrategy,
    AdminAuthResolver, //
    AdminAuthService,
    AdminService,
    JwtAdminStrategy,
  ],
})
export class AdminAuthModule {}
