import { Module } from '@nestjs/common';
import { Admin } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comic } from '../comics/entities/comic.entity';
import { JwtAccessStrategy } from '../../commons/auth/jwt-access.strategy';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Comic])],

  providers: [
    JwtAccessStrategy,
    AdminResolver, //
    AdminService,
  ],
})
export class AdminModule {}
