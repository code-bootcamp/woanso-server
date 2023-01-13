import { UpdateAdminInput } from '../dto/update.user.input';
import { Admin } from '../entities/admin.entity';

export interface IAdminServiceFindOne {
  email: string;
}

export interface IAdminServiceCreate {
  email: string;
  hashedPassword: string;
  nickname: string;
  phone: string;
}

export interface IAdminServiceUpdate {
  admin?: Admin;
  updateAdminInput?: UpdateAdminInput;
}

export interface IAdminServiceDelete {
  email: string;
  password: string;
}
