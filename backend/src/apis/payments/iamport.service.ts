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
      // 액세스 토큰(access token) 발급 받기
      const result = await axios.post('https://api.iamport.kr/users/getToken', {
        imp_key: process.env.IAMPORT_PAY,
        imp_secret: process.env.IAMPORT_SECRET,
      });

      //return result.data.response.access_token; //인증토큰

      const { access_token } = result.data.response; //인증토큰
      return access_token;
    } catch (error) {
      throw new HttpException(
        error.response.data.message,
        error.response.status,
      );
    }
  }

  //결제기록이 존재하는지 확인
  // async checkPaid({ impUid, amount, token }) {
  //   try {
  //     const result = await axios.get(
  //       `https://api.iamport.kr/payments/${impUid}`,
  //       { headers: { Authorization: `Bearer ${token}` } },
  //     );

  //     if (result.data.response.status !== 'paid')
  //       throw new ConflictException('결제 내역이 존재하지 않습니다.');

  //     if (result.data.response.amount !== amount)
  //       throw new UnprocessableEntityException('결제 금액이 잘못 되었습니다.');
  //   } catch (error) {
  //     if (error?.response?.data?.message) {
  //       throw new HttpException(
  //         error.response.data.message,
  //         error.response.status,
  //       );
  //     } else {
  //       throw error;
  //     }
  //   }
  // }

  //impUid로 서버에서 결제정보 조회하기
  async checkPaid({ impUid, getToken, amount }) {
    try {
      const access_token = getToken;
      const result = await axios.get(
        `https://api.iamport.kr/payments/${impUid}`,
        { headers: { Authorization: `Bearer ${access_token}` } },
      );

      const paymentData = result.data.response; // 조회한 결제 정보
      return paymentData;
      //--------------------------------여기까지 원래 코드//
    } catch (error) {
      throw new HttpException(
        error.response.data.message,
        error.response.status,
      );
    }
  }
  //------------------------------------------------

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

// import {
//   HttpException,
//   Injectable,
//   UnprocessableEntityException,
// } from '@nestjs/common';
// import axios from 'axios';

// @Injectable()
// export class IamportService {
//   async getToken() {
//     try {
//       const token = await axios({
//         url: 'https://api.iamport.kr/users/getToken',
//         method: 'post',
//         headers: { 'Content-Type': 'application/json' },
//         data: {
//           imp_key: process.env.IAMPORT_CLIENT_ID,
//           imp_secret: process.env.IAMPORT_CLIENT_SECRET,
//         },
//       });
//       const { access_token } = token.data.response;
//       return access_token;
//     } catch (error) {
//       throw new HttpException(
//         error.response.data.message,
//         error.response.status,
//       );
//     }
//   }

//   //impUid로 서버에서 결제정보 조회하기
//   async getPaymentData({ impUid, getToken }) {
//     try {
//       const access_token = getToken;
//       const getPaymentData = await axios({
//         url: `https://api.iamport.kr/payments/${impUid}`,
//         method: 'get', // GET method
//         headers: { Authorization: `Bearer ${access_token}` },
//       });
//       const paymentData = getPaymentData.data.response; // 조회한 결제 정보

//       return paymentData;
//     } catch (error) {
//       throw new HttpException(
//         error.response.data.message,
//         error.response.status,
//       );
//     }
//   }

//   async getCancelData({ access_token, payment }) {
//     try {
//       const { impUid, amount } = payment;
//       const getCancelData = await axios({
//         url: 'https://api.iamport.kr/payments/cancel',
//         method: 'post',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: access_token,
//         },
//         data: {
//           //reason, // 가맹점 클라이언트로부터 받은 환불사유
//           imp_uid: impUid, // imp_uid를 환불 `unique key`로 입력
//           amount, // 가맹점 클라이언트로부터 받은 환불금액
//         },
//       });
//       const { response } = getCancelData.data;
//       return response;
//     } catch (error) {
//       throw new UnprocessableEntityException('입력 값 오류입니다.');
//     }
//   }
// }
