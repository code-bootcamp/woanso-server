// import {
//   HttpException,
//   HttpStatus,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';

// import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '../users/users.service';
// import { UserDTO } from './dto/user.dto';
// import { Payload } from '../usersAuth/security.payload.interface';
// import { User } from '../users/entities/user.entity';

// @Injectable()
// export class AuthRoleService {
//   constructor(
//     private userService: UsersService,
//     private jwtService: JwtService,
//   ) {}

//   async registerUser(newUser: UserDTO): Promise<UserDTO> {
//     const userFind: UserDTO = await this.userService.findByFields({
//       where: { nickname: newUser.nickname },
//     });
//     if (userFind) {
//       throw new HttpException('Username already used!', HttpStatus.BAD_REQUEST);
//     }
//     return await this.userService.save(newUser);
//   }

//   async validateUser(userDTO: UserDTO): Promise<{ accessToken: string }> {
//     const userFind: User = await this.userService.findByFields({
//       where: { nickname: userDTO.nickname },
//     });
//     const validatePassword = await bcrypt.compare(
//       userDTO.password,
//       userFind.password,
//     );
//     if (!userFind || !validatePassword) {
//       throw new UnauthorizedException();
//     }
//     this.convertInAuthorities(userFind);
//     const payload: Payload = {
//       email: userFind.email,
//       nickname: userFind.nickname,
//       id: userFind.id,
//       phone: userFind.phone,
//       authorities: userFind.authorities,
//     };
//     return {
//       accessToken: this.jwtService.sign(payload),
//     };
//   }

//   async tokenValidateUser(payload: Payload): Promise<User | undefined> {
//     const userFind = await this.userService.findByFields({
//       where: { email: payload.email },
//     });
//     this.flatAuthorities(userFind);
//     return userFind;
//   }

//   private flatAuthorities(user: any): User {
//     if (user && user.authorities) {
//       const authorities: string[] = [];
//       user.authorities.forEach((authority) =>
//         authorities.push(authority.authorityName),
//       );
//       user.authorities = authorities;
//     }
//     return user;
//   }

//   private convertInAuthorities(user: any): User {
//     if (user && user.authorities) {
//       const authorities: any[] = [];
//       user.authorities.forEach((authority) => {
//         authorities.push({ name: authority.authorityName });
//       });
//       user.authorities = authorities;
//     }
//     return user;
//   }
// }
