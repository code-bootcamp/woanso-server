import { IAuthUser } from 'src/commons/types/context';
import { POINT_TRANSACTION_STATUS_ENUM } from '../entities/payment.entity';

export interface IPointsTransactionsServiceCreate {
  impUid: string;
  amount: number;
  user: IAuthUser['user'];
  status: POINT_TRANSACTION_STATUS_ENUM;
}
