import { RequestMethodEnum } from '@/common/enums';
import { InfinityPayHttpClient } from '../http-client';

export class PamPayByIdRequest extends InfinityPayHttpClient {
  constructor(vendorForm: Record<string, any>) {
    super();
    const partnerTransId = vendorForm['transactionId'];

    this.setMethod(RequestMethodEnum.PAM_PAY_BY_ID)
      .setParams({
        vendor_form: vendorForm,
        pay_form: {
          card_id: partnerTransId,
        },
      })
      .setIsLog(true);
  }

  getDetails() {
    const result: any = this.getResult();
    return result?.details;
  }
}
