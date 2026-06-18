import { RequestMethodEnum } from '@/common/enums';
import { InfinityPayHttpClient } from '../http-client';

export class PamConfirmPayRequest extends InfinityPayHttpClient {
  constructor(confirmationCode: string, bankTransactionId: string) {
    super();
    this.setMethod(RequestMethodEnum.PAM_CONFIRM_PAY)
      .setParams({
        confirm_form: {
          confirmation_code: confirmationCode,
          bank_transaction_id: +bankTransactionId,
        },
      })
      .setIsLog(true);
  }

  getDetails() {
    const result = this.getResult();
    return result?.details;
  }
}
