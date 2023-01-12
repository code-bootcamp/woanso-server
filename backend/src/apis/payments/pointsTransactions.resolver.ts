import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Int, Context } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { PointsTransactionsService } from './pointsTransactions.service';
import { IContext } from 'src/commons/types/context';
import { IamportService } from './iamport.service';
import { PointTransaction } from './entities/payment.entity';

@Resolver()
export class PointsTransactionsResolver {
  constructor(
    private readonly pointsTransactionsService: PointsTransactionsService,
    private readonly iamportService: IamportService,
  ) {}

  ///////////////////////////

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => PointTransaction)
  async createPointTransaction(
    @Args('impUid') impUid: string,
    @Args('comicId') comicId: string,
    @Args({ name: 'amount', type: () => Int }) amount: number,
    @Context() context: IContext,
  ): Promise<any> {
    //검증 로직
    // 1. 아임포트에 요청해서 결제 완료 기록이 존재하는지 확인.
    const token = await this.iamportService.getToken();
    await this.iamportService.checkPaid({ impUid, amount, token });

    // 2. pointTransaction 테이블에는 impUid가 1번만 존재. (중복 결제를 체크)
    await this.pointsTransactionsService.checkDuplicate({ impUid });
    const user = context.req.user;
    return this.pointsTransactionsService.create({
      impUid,
      amount: amount + 8000,
      user,
      comicId,
    });
  }

  ////////////////////////

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => PointTransaction)
  async cancelPointTransaction(
    @Args('impUid') impUid: string,
    @Args('comicId') comicId: string,
    @Context() context: IContext,
  ) {
    const user = context.req.user;
    //검증로직

    //1. 이미 취소된 건인지 확인    //////////////////////////////////
    await this.pointsTransactionsService.isCancelled({ impUid });

    //2. 취소하기에 충분한 포인트 잔액이 남아있는 지   ///////////////////////
    // await this.pointsTransactionsService.checkHasCancelablePoint({
    //   impUid,
    //   user,
    // });

    //3. 실제로 아임포트에 취소 요청  //////////////////////////////////
    const token = await this.iamportService.getToken();
    const cancelledAmount = await this.iamportService.cancel({ impUid, token });

    //4. 테이블에 결제 취소 등록 /////////////////////
    return await this.pointsTransactionsService.cancel({
      impUid,
      amount: cancelledAmount,
      _user: user,
      comicId,
    });
  }
}
