import {
  Injectable,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  PointTransaction,
  POINT_TRANSACTION_STATUS_ENUM,
} from './entities/payment.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Comic } from '../comics/entities/comic.entity';

@Injectable()
export class PointsTransactionsService {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointsTransactionsRepository: Repository<PointTransaction>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Comic)
    private readonly comicRepository: Repository<Comic>,

    private readonly dataSource: DataSource,
  ) {}

  //--------------------**[결제 생성]**--------------------

  // 1. pointTransaction 테이블에 거래기록 1줄 생성
  async create({
    impUid,
    amount,
    user: _user,
    comicId,
    address,
  }): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); // DB접속, promise 필수
    await queryRunner.startTransaction('SERIALIZABLE'); // Transaction 시작

    try {
      // 2. 유저의 돈 찾아오기
      // const user = await queryRunner.manager.findOne(User, {
      //   where: { email: _user.email },
      //   lock: { mode: 'pessimistic_write' },
      // });
      const stock1 = await this.comicRepository.findOne({ where: { comicId } });
      //console.log(stock1);
      await this.comicRepository.save({
        comicId: stock1.comicId,
        stock: stock1.stock - 1,
      });
      //console.log(stock1);
      const stock2 = await this.comicRepository.findOne({ where: { comicId } });
      if (stock2.stock === 0) {
        await this.comicRepository.update({ comicId }, { isAvailable: false });
      } // 수량이 0이라면 대여불가능

      const deliveryFee = 8000;
      const totalPrice = amount + deliveryFee;
      const comic = await this.comicRepository.findOne({
        where: { comicId },
      });

      const pointTransaction = this.pointsTransactionsRepository.create({
        impUid,
        amount: amount,
        user: _user, //user??
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
        address,
        totalPrice,
        comic,
        deliveryFee: 8000,
      });

      await queryRunner.manager.save(pointTransaction);
      // console.log('왜들 그리 다운되ㅇ어있어');
      // await this.pointsTransactionsRepository.save(pointTransaction);

      // await queryRunner.manager.save(updateAmount); // amount + delivery fee
      //await queryRunner.commitTransaction();

      // 결제 될 때마다 수량 1개씩 낮춰주기

      await queryRunner.commitTransaction();

      // 4, 최종 결과 브라우저에 돌려주기
      return pointTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //--------------------**[결제 취소]**--------------------
  async cancel({ impUid, amount, _user, comicId }) {
    // const pointTransaction = await this.create({
    //   impUid,
    //   amount: -amount,
    //   user,
    //   status: POINT_TRANSACTION_STATUS_ENUM.CANCEL,
    //   comicId,
    // });
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect(); // DB접속, promise 필수
    await queryRunner.startTransaction('SERIALIZABLE'); // Transaction 시작
    try {
      const pointTransaction = this.pointsTransactionsRepository.create({
        impUid,
        amount: -amount,
        user: _user,
        status: POINT_TRANSACTION_STATUS_ENUM.CANCEL,
      });

      await queryRunner.manager.save(pointTransaction);
      // await this.pointsTransactionsRepository.save(pointTransaction);

      const stock = await this.comicRepository.findOne({ where: comicId });
      await this.comicRepository.update(
        { comicId },
        { stock: stock.stock + 1 },
      );
      const stock2 = await this.comicRepository.findOne({ where: comicId });

      if (stock2.stock !== 0) {
        await this.comicRepository.update({ comicId }, { isAvailable: true });
      }

      await queryRunner.commitTransaction();

      // 4, 최종 결과 브라우저에 돌려주기
      return pointTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //////////////////////////////////////////////////////////////////////

  // async checkDuplicate({ impUid }) {
  //   const findPayment = await this.pointsTransactionsRepository.findOne({
  //     where: { impUid },
  //   });
  //   if (findPayment) throw new ConflictException('이미 결제되었습니다.');
  // }
  //생성하려는 결제정보랑 토큰에 들어있는 결제 정보랑 같은지 검증하기.
  async validate({ impUid, amount, checkPaid }) {
    //결제한 건이 아닐경우
    if (checkPaid.status !== 'paid') {
      throw new ConflictException('결제 내역이 존재하지 않습니다.');
    }

    //토큰을 통해 결제한 금액이랑 데이터베이스에 입력하려는 금액이 맞는지 확인하기
    if (amount !== checkPaid.amount) {
      throw new UnprocessableEntityException(
        '결제하신 금액과 다른 금액입니다.',
      );
    }

    //이미 추가된 결제 건인지 확인하기 impUid가 하나만 조회되어야함.
    const payment = await this.pointsTransactionsRepository.findOne({
      where: { impUid: impUid },
    });
    if (payment) {
      throw new ConflictException('이미 결제 되었습니다.');
    }
  }

  //////////////////////////////////////////////////////////////////////

  async isCancelled({ impUid }) {
    const pointTransaction = await this.pointsTransactionsRepository.findOne({
      where: { impUid, status: POINT_TRANSACTION_STATUS_ENUM.CANCEL },
    });
    if (pointTransaction)
      throw new ConflictException('이미 취소된 결제입니다.');
  }

  //////////////////////////////////////////////////////////////////////

  async isRefund({ impUid }) {
    const findRefund = await this.pointsTransactionsRepository.findOne({
      where: { impUid },
    });
    if (findRefund.status === 'CANCEL') {
      throw new UnprocessableEntityException('이미 환불되었습니다.');
    }
  }

  //////////////////////////////////////////////////////////////////////

  // async checkHasCancelablePoint({ impUid, user }) {
  //   const pointTransaction = await this.pointsTransactionsRepository.findOne({
  //     where: {
  //       impUid,
  //       user,
  //       status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
  //     },
  //   });
  //   if (!pointTransaction)
  //     throw new UnprocessableEntityException('결제 기록이 존재하지 않습니다.');
  // }
}
