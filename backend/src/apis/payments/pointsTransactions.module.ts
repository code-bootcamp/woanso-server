import { Module } from '@nestjs/common';
import { PointsTransactionsResolver } from './pointsTransactions.resolver';
import { PointsTransactionsService } from './pointsTransactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/apis/users/entities/user.entity';
import { IamportService } from './iamport.service';
import { PointTransaction } from './entities/payment.entity';
import { ComicsService } from '../comics/comics.service';
import { Comic } from '../comics/entities/comic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PointTransaction, //
      User,
      Comic,
    ]),
  ],

  providers: [
    PointsTransactionsResolver, //
    PointsTransactionsService,
    IamportService,
    ComicsService,
  ],
})
export class PointsTransactionsModule {}
