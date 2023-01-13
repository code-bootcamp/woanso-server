import {
  Injectable,
  HttpException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class IamportService {
  async getToken() {
    try {
      const result = await axios.post('https://api.iamport.kr/users/getToken', {
        imp_key: process.env.IAMPORT_PAY,
        imp_secret: process.env.IAMPORT_SECRET,
      });
      return result.data.response.access_token;
    } catch (error) {
      throw new HttpException(
        error.response.data.message,
        error.response.status,
      );
    }
  }

  //결제기록이 존재하는지 확인
  async checkPaid({ impUid, amount, token }) {
    try {
      const result = await axios.get(
        `https://api.iamport.kr/payments/${impUid}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (result.data.response.status !== 'paid')
        throw new ConflictException('결제 내역이 존재하지 않습니다.');

      if (result.data.response.amount !== amount)
        throw new UnprocessableEntityException('결제 금액이 잘못 되었습니다.');
    } catch (error) {
      if (error?.response?.data?.message) {
        throw new HttpException(
          error.response.data.message,
          error.response.status,
        );
      } else {
        throw error;
      }
    }
  }

  async cancel({ impUid, token }) {
    try {
      const result = await axios.post(
        'https://api.iamport.kr/payments/cancel',
        { imp_uid: impUid },
        { headers: { Authorization: token } },
      );
      return result.data.response.cancel_amount;
    } catch (error) {
      throw new HttpException(
        error.response.data.message,
        error.response.status,
      );
    }
  }
}
