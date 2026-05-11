import { RequestMethodEnum } from '@/common/enums';
import { InfinityPayHttpClient } from '../http-client';

export class PamPayResendSmsRequest extends InfinityPayHttpClient {
  constructor(partnerTransactionId: number) {
    super();
    this.setMethod(RequestMethodEnum.PAM_PAY_RESEND_SMS)
      .setParams({
        bank_transaction_id: partnerTransactionId,
      })
      .setIsLog(false);
  }

  getConfermationCode() {
    const result = this.getResult();
    return result?.details?.confirm_form;
  }
}
