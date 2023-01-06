import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserImg } from './entities/usersImg.entity';
import { UserImgResolver } from './userImg.resolver';
import { UserImgService } from './userImg.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserImg, //
    ]),
  ],

  providers: [
    UserImgResolver, //
    UserImgService,
  ],
})
export class UserImgModule {}
