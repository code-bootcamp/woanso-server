import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import * as bcrypt from 'bcrypt';
import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';
import { IContext } from 'src/commons/types/context';
import { Cache } from 'cache-manager';
import { Admin } from './entities/admin.entity';
import { UpdateAdminInput } from './dto/update.user.input';
import { GqlAdminGuard } from '../../commons/auth/gql-auth.guard';

@Resolver()
export class AdminResolver {
  constructor(
    private readonly adminService: AdminService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  //------------------**[어드민 회원가입]**------------------
  @Mutation(() => Admin)
  async signUpForAdmin(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('nickname') nickname: string,
    @Args('phone') phone: string,
  ): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.adminService.create({
      email,
      hashedPassword,
      nickname,
      phone,
    });
  }

  //------------------**[어드민 유저 찾기]**------------------
  @Query(() => Admin)
  findEmailForAdmin(@Args('email') email: string): Promise<Admin> {
    return this.adminService.findOne({ email });
  }

  //------------------**[어드민 업데이트]**------------------
  @UseGuards(GqlAdminGuard)
  @Mutation(() => Admin)
  async updateAdmin(
    @Args('email') email?: string,
    @Args('updateAdminInput') updateAdminInput?: UpdateAdminInput,
  ): Promise<Admin> {
    const admin = await this.adminService.findOne({ email });

    return this.adminService.update({
      admin,
      updateAdminInput,
    });
  }

  //----------------------**[어드민 회원 탈퇴]**----------------------
  @UseGuards(GqlAdminGuard)
  @Mutation(() => Boolean)
  deleteAdmin(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<boolean> {
    return this.adminService.delete({ email, password });
  }
  //------------------**[어드민 인가]**------------------
  @UseGuards(GqlAdminGuard)
  @Query(() => String)
  authAdmin(
    @Context() context: IContext, //
  ): string {
    console.log(context.req.user);
    console.log(context);
    return '인가 성공';
  }
}
