import { RequestMethodEnum } from '@/common/enums';
import { InfinityPayHttpClient } from '../http-client';
import { PamPayByIdRequestDto } from '@/integrations/dto';

export class PamPreparePayRequest extends InfinityPayHttpClient {
  constructor(requestData: PamPayByIdRequestDto) {
    super();
    this.setMethod(RequestMethodEnum.PAM_PREPARE_PAY)
      .setParams({
        vendor_form: requestData.vendor_form,
        pay_form: {
          card_id: requestData.card_id,
        },
      })
      .setIsLog(true);
  }

  getBankTransactionId(): number {
    let bankTransactionId = 0;
    const result = this.getResult();
    const confirmForm: any[] = result.confirm_form ?? [];

    confirmForm.forEach((item: any) => {
      if (item.key === 'bank_transaction_id') {
        bankTransactionId = item.value;
      }
    });

    return bankTransactionId;
  }

  getConfirmParams() {
    const result = this.getResult();

    return {
      masked_phone_number: result.masked_phone_number,
      time_out: result.time_out,
      confirm_form: result.confirm_form[0],
      bank_transaction_id: result.confirm_form[1].value,
    };
  }
}
