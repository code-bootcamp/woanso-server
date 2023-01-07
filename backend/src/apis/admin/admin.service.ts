import {
  Injectable,
  ConflictException,
  UnprocessableEntityException,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import coolsms from 'coolsms-node-sdk';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import {
  IAdminServiceCreate,
  IAdminServiceDelete,
  IAdminServiceFindOne,
  IAdminServiceFindOneForUpdate,
  IAdminServiceUpdate,
} from './interfaces/admin-service.interface';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  //------------------------**[Create]**-------------------------------
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

  //------------------------**[Fetch ADMIN by PHONE]**-------------------------------
  findOne({ email }: IAdminServiceFindOne): Promise<Admin> {
    return this.adminRepository.findOne({ where: { email } });
  }

  //--------------------**[Find ADMIN for update password]**--------------------
  findOneForUpdate({
    email,
    phone,
  }: IAdminServiceFindOneForUpdate): Promise<Admin> {
    return this.adminRepository.findOne({ where: { email, phone } });
  }

  //------------------------**[Update ADMIN]**-------------------------------
  update({ admin, updateAdminInput }: IAdminServiceUpdate): Promise<Admin> {
    const result = this.adminRepository.save({
      ...admin, //
      ...updateAdminInput,
    });
    return result;
  }

  //------------------------**[Update password]**-------------------------------
  async updatePassword({ email, hashedPassword }) {
    const user = this.adminRepository.findOne({ where: email });
    await this.adminRepository.save({
      password: hashedPassword,
      ...user,
    });
  }

  //------------------------**[Delete ADMIN]**-------------------------------
  async delete({ email }: IAdminServiceDelete): Promise<boolean> {
    const admin = await this.adminRepository.findOne({
      where: { email },
    });

    const result = await this.adminRepository.softDelete({ email });
    return result.affected ? true : false;
  }

  //------------------------**[Send token by PHONE]**-------------------------------
  async sendToken({ phone }) {
    const SMS_KEY = process.env.SMS_KEY;
    const SMS_SECRET = process.env.SMS_SECRET;
    const SMS_SENDER = process.env.SMS_SENDER;

    // prettier-ignore
    if (phone.length < 10 || phone.length > 11) {
      const digit = await this.adminRepository.findOne({where: { phone: phone },});

    // prettier-ignore
      if (digit) {throw new ConflictException('이미 등록된 번호입니다.')}
    // prettier-ignore
      const token = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
      const SMSservice = new coolsms(SMS_KEY, SMS_SECRET);
      await SMSservice.sendOne({
        to: phone,
        from: SMS_SENDER,
        text: `[관리자 전용] 회원가입 인증번호는 [${token}] 입니다.`,
        type: 'SMS',
        autoTypeDetect: false,
      });

      const myToken = await this.cache.get(phone);
      if (myToken) {await this.cache.del(phone)}
      await this.cache.set(phone, token);
      return token;
    }
  }

  //------------------------**[Auth token]**-------------------------------
  async authToken({ phone, token }) {
    const myToken = await this.cache.get(phone);

    if (myToken === token) return true;
    else {
      throw new UnprocessableEntityException('인증번호가 잘못 되었습니다.');
    }
  }
}
