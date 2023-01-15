// import {
//   HttpException,
//   Injectable,
//   UnprocessableEntityException,
// } from '@nestjs/common';
// import axios from 'axios';

// @Injectable()
// export class IamportService1 {
//   async getToken() {
//     try {
//       // 액세스 토큰(access token) 발급 받기
//       const token = await axios({
//         url: 'https://api.iamport.kr/users/getToken',
//         method: 'post',
//         headers: { 'Content-Type': 'application/json' },
//         data: {
//           imp_key: process.env.IAMPORT_CLIENT_ID,
//           imp_secret: process.env.IAMPORT_CLIENT_SECRET,
//         },
//       });
//       const { access_token } = token.data.response; //인증토큰
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

//   async getCancelData({ access_token, payment, reason }) {
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
//           reason, // 가맹점 클라이언트로부터 받은 환불사유
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
