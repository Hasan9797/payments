import { RequestMethodEnum } from '@/common/enums';
import { InfinityPayHttpClient } from '../http-client';

export class PamGetFiscalDetailsRequest extends InfinityPayHttpClient {
  constructor(partnerTransactionId: string) {
    super();
    this.setMethod(RequestMethodEnum.PAM_GET_FISCAL_DETAILS)
      .setParams({ transaction_id: +partnerTransactionId })
      .setIsLog(true);
  }
}
