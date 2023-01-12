import {
  Injectable,
  ConflictException,
  UnprocessableEntityException,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  IAdminServiceUnblock,
  IAdminServiceUserDelete,
  IUsersServiceCreate,
  IUsersServiceDelete,
  IUsersServiceFindEmail,
  IUsersServiceFindOne,
  IUsersServiceFindOneForUpdate,
  IUsersServiceUpdate,
} from './interfaces/users-service.interface';
import coolsms from 'coolsms-node-sdk';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  //------------------------**[Create]**-------------------------------
  async create({
    email,
    hashedPassword: password,
    nickname,
    phone,
    interest,
  }: IUsersServiceCreate): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) throw new ConflictException();

    return this.usersRepository.save({
      email,
      nickname,
      phone,
      password,
      interest,
    });
  }

  //--------------------**[Find User by EMAIL]**--------------------
  findOne({ email }: IUsersServiceFindOne): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  //--------------------**[Find Login]**--------------------
  async findLogin({ context }) {
    console.log(context.req.user.email);
    return await this.usersRepository.findOne({
      where: { email: context.req.user.email },
    });
  }

  //--------------------**[Find User for update PWD]**--------------------
  findOneForUpdate({
    email,
    phone,
  }: IUsersServiceFindOneForUpdate): Promise<User> {
    return this.usersRepository.findOne({ where: { email, phone } });
  }

  //--------------------**[Find email by Phone]**--------------------
  findEmail({ phone }: IUsersServiceFindEmail): Promise<User> {
    return this.usersRepository.findOne({ where: { phone } });
  }

  //--------------------**[Update user]**--------------------
  update({ user, updateUserInput }: IUsersServiceUpdate): Promise<User> {
    const result = this.usersRepository.save({
      ...user, //
      ...updateUserInput,
    });
    return result;
  }

  //--------------------**[Update password]**--------------------
  async updatePassword({ email, hashedPassword: newPassword }) {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      await this.usersRepository.save({
        ...user,
        password: newPassword,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  //------------------------**[Delete user]**-------------------------------
  async delete({ email }: IUsersServiceDelete): Promise<boolean> {
    // const user = await this.usersRepository.findOne({
    //   where: { email },
    // });

    const result = await this.usersRepository.delete({ email });
    return result.affected ? true : false;
  }

  //--------------------**[Send token by PHONE]**--------------------
  async sendToken({ phone }) {
    const SMS_KEY = process.env.SMS_KEY;
    const SMS_SECRET = process.env.SMS_SECRET;
    const SMS_SENDER = process.env.SMS_SENDER;

    // prettier-ignore
    if (phone.length < 10 || phone.length > 11) {
      const digit = await this.usersRepository.findOne({where: { phone: phone },});

    // prettier-ignore
      if (digit) {throw new ConflictException('이미 등록된 번호입니다.')}

    // prettier-ignore
      const token = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
      const SMSservice = new coolsms(SMS_KEY, SMS_SECRET);
      await SMSservice.sendOne({
        to: phone,
        from: SMS_SENDER,
        text: `[완소] 안녕하세요. 회원가입 인증번호는 [${token}] 입니다.`,
        type: 'SMS',
        autoTypeDetect: false,
      });

      const myToken = await this.cache.get(phone);
      if (myToken) {await this.cache.del(phone)}
      await this.cache.set(phone, token);
      return token;
    }
  }
  //--------------------**[Auth token]**--------------------
  async authToken({ phone, token }) {
    const myToken = await this.cache.get(phone);

    if (myToken === token) return true;
    else {
      throw new UnprocessableEntityException('인증번호가 잘못 되었습니다.');
    }
  }

  //----------------------**[FOR ADMIN]**----------------------
  //----------------------**[FOR ADMIN]**----------------------
  //----------------------**[FOR ADMIN]**----------------------

  //----------------------**[Fetch all users for admin]**--------------------
  async findAll(email): Promise<User[]> {
    return this.usersRepository.find(email);
  }

  // async findAll() {
  //   return await this.usersRepository
  //     .createQueryBuilder('user')
  //     .skip(6 * (1 - 1))
  //     .take(6)
  //     .getMany();
  // }

  //------------------------**[Block User]**-------------------------------
  async deleteUser({ email }: IAdminServiceUserDelete): Promise<boolean> {
    // const user = await this.usersRepository.findOne({
    //   where: { email },
    // });

    const result = await this.usersRepository.softDelete({ email });
    return result.affected ? true : false;
  }
  //----------------------**[Restore User]**----------------------
  async restoreUser({ email }: IAdminServiceUnblock): Promise<boolean> {
    const result = await this.usersRepository.restore({ email });
    return result.affected ? true : false;
  }

  //----------------------**[Fetch Blocked for admin]**---------------------------
  async findBlocked(email): Promise<User[]> {
    return this.usersRepository.find(email);
  }

  //------------------------**[Find Login Users]**-------------------------------
  async findLogins({ context }) {
    console.log(context.req.user.email);
    return await this.usersRepository.find({
      where: { email: context.req.user.email },
    });
  }
}
