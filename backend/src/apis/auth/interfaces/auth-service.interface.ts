import { User } from 'src/apis/users/entities/user.entity';
import { IAuthUserItem } from 'src/commons/types/context';
import { Request, Response } from 'express';

export interface IAuthServiceGetAccessToken {
  user: User | IAuthUserItem;
}

export interface IAUthServiceSetRefreshToken {
  user: User;
  res: Response;
  req?: Request;
}
