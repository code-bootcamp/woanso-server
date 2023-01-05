import {
  Injectable,
  ConflictException,
  UnprocessableEntityException,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  IUsersServiceCreate,
  IUsersServiceCreateAdmin,
  IUsersServiceDelete,
  IUsersServiceFindEmail,
  IUsersServiceFindOne,
  IUsersServiceFindOneForUpdate,
  IUsersServiceUpdate,
} from './interfaces/users-service.interface';
import coolsms from 'coolsms-node-sdk';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { UserDTO } from '../auth/dto/user.dto';

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

  //------------------------**[Create ADMIN user]**-------------------------------
  async createAdmin({
    email,
    hashedPassword: password,
    phone,
  }: IUsersServiceCreateAdmin) {
    return this.usersRepository.save({
      email,
      password,
      phone,
    });
  }

  //------------------------**[Find one user by EMAIL]**-------------------------------
  findOne({ email }: IUsersServiceFindOne): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  //------------------------**[Find one user for update password]**-------------------------------
  findOneForUpdate({
    email,
    phone,
  }: IUsersServiceFindOneForUpdate): Promise<User> {
    return this.usersRepository.findOne({ where: { email, phone } });
  }

  //------------------------**[Find email by PHONE]**-------------------------------
  findEmail({ phone }: IUsersServiceFindEmail): Promise<User> {
    return this.usersRepository.findOne({ where: { phone } });
  }

  //------------------------**[Fetch all users for admin]**-------------------------------
  async findAll(email): Promise<User[]> {
    return this.usersRepository.find(email);
  }

  //------------------------**[Update user]**-------------------------------
  update({ user, updateUserInput }: IUsersServiceUpdate): Promise<User> {
    const result = this.usersRepository.save({
      ...user, //
      ...updateUserInput,
    });
    return result;
  }

  //------------------------**[Update password]**-------------------------------
  async updatePassword({ email, hashedPassword }) {
    const user = this.usersRepository.findOne({ where: email });
    await this.usersRepository.save({
      password: hashedPassword,
      ...user,
    });
  }

  //------------------------**[Delete user]**-------------------------------
  async delete({ email }: IUsersServiceDelete): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (user.role !== 'ADMIN') {
      throw new ConflictException('권한없음');
    }

    const result = await this.usersRepository.softDelete({ email });
    return result.affected ? true : false;
  }

  //------------------------**[Send token by PHONE]**-------------------------------
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

  //------------------------**[Auth token]**-------------------------------
  async authToken({ phone, token }) {
    const myToken = await this.cache.get(phone);

    if (myToken === token) return true;
    else {
      throw new UnprocessableEntityException('인증번호가 잘못 되었습니다.');
    }
  }

  //------------------------**[Block user]**-------------------------------

  async blockUser({ email, id }) {
    const admin = await this.usersRepository.findOne({
      where: { email },
    });

    this.userRole({ admin });
  }

  userRole({ admin }) {
    if (!admin) {
      throw new ConflictException('존재하지 않는 계정입니다.');
    }
    if (admin.role !== 'ADMIN') {
      throw new ConflictException('관리자가 아닙니다.');
    }
  }
  //------------------------**[ROLE LOGIC]**-------------------------------
  async findByFields(
    options: FindOneOptions<UserDTO>,
  ): Promise<User | undefined> {
    return await this.usersRepository.findOne(options);
  }

  async save(userDTO: UserDTO): Promise<UserDTO | undefined> {
    await this.transformPassword(userDTO);
    console.log(userDTO);
    return await this.usersRepository.save(userDTO);
  }

  async transformPassword(user: UserDTO): Promise<void> {
    user.password = await bcrypt.hash(user.password, 10);
    return Promise.resolve();
  }
}
