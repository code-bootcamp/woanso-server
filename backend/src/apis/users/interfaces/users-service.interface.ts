import { UpdateUserInput } from '../dto/update.user.input';
import { User } from '../entities/user.entity';

export interface IUsersServiceFindOne {
  email: string;
}

export interface IUsersServiceFindLogin {
  user?: User;
}

export interface IUsersServiceFindOneForUpdate {
  email: string;
  phone: string;
}

export interface IUsersServiceFindEmail {
  phone: string;
}

export interface IUsersServiceCreate {
  email: string;
  hashedPassword: string;
  nickname: string;
  phone: string;
  interest?: string;
}

export interface IUsersServiceCreateAdmin {
  email: string;
  hashedPassword: string;
  phone?: string;
}

export interface IUsersServiceUpdate {
  user: User;
  updateUserInput: UpdateUserInput;
}

export interface IUsersServiceDelete {
  email: string;
  password: string;
}

export interface IAdminServiceUserDelete {
  email: string;
}
export interface IAdminServiceUnblock {
  email: string;
}
