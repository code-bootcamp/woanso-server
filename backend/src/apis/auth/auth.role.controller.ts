// import {
//   Body,
//   Controller,
//   Get,
//   Post,
//   Req,
//   Res,
//   UseGuards,
//   UsePipes,
//   ValidationPipe,
// } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { UserDTO } from './dto/user.dto';
// import { AuthRoleService } from './auth.role.service';
// import { AuthGuard } from '@nestjs/passport';
// import { RolesGuard } from '../usersAuth/role.guard';
// import { Roles } from '../usersAuth/role.decorator';
// import { RoleType } from '../usersAuth/role.type';

// @Controller()
// export class AuthRoleController {
//   constructor(private readonly authRoleService: AuthRoleService) {}

//   @Post('/register')
//   @UsePipes(ValidationPipe)
//   async registerAccount(@Body() userDTO: UserDTO): Promise<any> {
//     return await this.authRoleService.registerUser(userDTO);
//   }

//   @Post('/login')
//   async login(@Body() userDTO: UserDTO, @Res() res: Response): Promise<any> {
//     const jwt = await this.authRoleService.validateUser(userDTO);
//     res.setHeader('Authorization', 'Bearer ' + jwt.accessToken);
//     res.cookie('jwt', jwt.accessToken, {
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000,
//     });
//     return res.send({
//       message: 'success',
//     });
//   }

//   @Get('/authenticate')
//   @UseGuards(AuthGuard)
//   isAuthenticated(@Req() req: Request): any {
//     const user: any = req.user;
//     return user;
//   }

//   @Get('/admin-role')
//   @UseGuards(AuthGuard, RolesGuard)
//   @Roles(RoleType.ADMIN)
//   adminRoleCheck(@Req() req: Request): any {
//     const user: any = req.user;
//     return user;
//   }

//   @Get('/cookies')
//   getCookies(@Req() req: Request, @Res() res: Response): any {
//     const jwt = req.cookies['jwt'];
//     return res.send(jwt);
//   }

//   @Post('/logout')
//   logout(@Res() res: Response): any {
//     res.cookie('jwt', '', {
//       maxAge: 0,
//     });
//     return res.send({
//       message: 'success',
//     });
//   }
// }
