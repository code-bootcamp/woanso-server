import { Request, Response } from 'express';

export interface IAuthUserItem {
  email: string;
  id: string;
  exp: number;
}

export interface IAuthUser {
  user?: IAuthUserItem;
}

export interface IContext {
  req?: Request & IAuthUser;
  res?: Response;
}

export interface IAdminAuthUser {
  email: string;
  id: string;
  exp: number;
}

export interface IAdminContext {
  req: Request & IAdminAuthUser;
  res: Response;
}
