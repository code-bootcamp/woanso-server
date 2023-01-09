import { Response, Request } from 'express';
import { Admin } from 'src/apis/admin/entities/admin.entity';
import { IAdminAuthUser } from 'src/commons/types/context';

export interface IAdminAuthServiceGetAccessToken {
  admin: Admin | IAdminAuthUser;
}

export interface IAdminAuthServiceSetRefreshToken {
  admin: Admin;
  res: Response;
  req?: Request;
}
