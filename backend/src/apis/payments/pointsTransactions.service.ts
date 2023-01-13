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

  //1. 생성해서 한 줄 만들기
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
      const pointTransaction = this.pointsTransactionsRepository.create({
        impUid,
        amount,
        user: _user,
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
        address,
      });

      await queryRunner.manager.save(pointTransaction);
      // await this.pointsTransactionsRepository.save(pointTransaction);

      const stock = await this.comicRepository.findOne({ where: comicId });
      await this.comicRepository.update(
        { comicId },
        { stock: stock.stock - 1 },
      );
      const stock2 = await this.comicRepository.findOne({ where: comicId });
      if (stock2.stock === 0) {
        await this.comicRepository.update({ comicId }, { isAvailable: false });
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
      await this.pointsTransactionsRepository.save(pointTransaction);

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

  async checkDuplicate({ impUid }) {
    const findPayment = await this.pointsTransactionsRepository.findOne({
      where: { impUid },
    });
    if (findPayment) throw new ConflictException('이미 결제되었습니다.');
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

  async checkHasCancelablePoint({ impUid, user }) {
    const pointTransaction = await this.pointsTransactionsRepository.findOne({
      where: {
        impUid,
        user,
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      },
    });
    if (!pointTransaction)
      throw new UnprocessableEntityException('결제 기록이 존재하지 않습니다.');
  }
}
