import { RequestMethodEnum } from '@/common/enums';
import { InfinityPayHttpClient } from '../http-client';
import { PamPayByIdRequestDto } from '@/integrations/dto/pam-request.dto';

export class PamPreparePayByIdRequest extends InfinityPayHttpClient {
  constructor(requestData: PamPayByIdRequestDto) {
    super();

    this.setMethod(RequestMethodEnum.PAM_PREPARE_PAY_BY_ID)
      .setParams({
        vendor_form: requestData.vendor_form,
        pay_form: {
          card_id: requestData.card_id,
        },
      })
      .setIsLog(true);
  }

  getBankTransactionId(): string | null {
    const result: any = this.getResult();
    return (
      result?.confirm_form.find(
        (item: any) => item.key === 'bank_transaction_id',
      )?.value ?? null
    );
  }
}
