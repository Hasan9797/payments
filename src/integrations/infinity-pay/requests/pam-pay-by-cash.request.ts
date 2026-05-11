import { RequestMethodEnum } from '@/common/enums';
import { InfinityPayHttpClient } from '../http-client';

export class PamPayByCashRequest extends InfinityPayHttpClient {
  constructor(vendorForm: Record<string, any>) {
    super();
    const partnerTransId = vendorForm['transactionId'];

    this.setMethod(RequestMethodEnum.PAM_PAY_BY_CASH)
      .setParams({
        vendor_form: vendorForm,
        transaction_form: {
          partner_transaction_id: partnerTransId,
        },
      })
      .setIsLog(true);
  }

  getDetails() {
    const result: any = this.getResult();
    return result?.details;
  }
}
