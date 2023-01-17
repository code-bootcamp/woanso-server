import {
  Injectable,
  ConflictException,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import {
  IAdminServiceCreate,
  IAdminServiceDelete,
  IAdminServiceFindOne,
  IAdminServiceUpdate,
} from './interfaces/admin-service.interface';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  //------------------------**[회원가입]**-------------------------------
  async create({
    email,
    hashedPassword: password,
    nickname,
    phone,
  }: IAdminServiceCreate): Promise<Admin> {
    const user = await this.adminRepository.findOne({ where: { email } });
    if (user) throw new ConflictException();

    return this.adminRepository.save({
      email,
      nickname,
      phone,
      password,
    });
  }

  //------------------------**[어드민 유저 찾기]**-------------------------------
  findOne({ email }: IAdminServiceFindOne): Promise<Admin> {
    return this.adminRepository.findOne({ where: { email } });
  }

  //------------------------**[어드민 업데이트]**-------------------------------
  update({ admin, updateAdminInput }: IAdminServiceUpdate): Promise<Admin> {
    const result = this.adminRepository.save({
      ...admin, //
      ...updateAdminInput,
    });
    return result;
  }

  //------------------------**[어드민 회원 탈퇴]**-------------------------------
  async delete({ email }: IAdminServiceDelete): Promise<boolean> {
    const result = await this.adminRepository.softDelete({ email });
    return result.affected ? true : false;
  }
}
