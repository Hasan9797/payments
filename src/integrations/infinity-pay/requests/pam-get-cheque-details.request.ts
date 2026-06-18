import { RequestMethodEnum } from '@/common/enums';
import { InfinityPayHttpClient } from '../http-client';

export class PamGetChequeDetailsRequest extends InfinityPayHttpClient {
  constructor(partnerTransactionId: string) {
    super();
    this.setMethod(RequestMethodEnum.PAM_GET_CHEQUE_DETAILS)
      .setParams({
        transaction_id: +partnerTransactionId,
      })
      .setIsLog(true);
  }

  getChequeUrl() {
    const result: { url: string } = this.getResult();
    return result.url;
  }
}
