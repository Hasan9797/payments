import { RequestMethodEnum } from '@/common/enums';
import { InfinityPayHttpClient } from '../http-client';
import { PamResponse } from '@/common/interfaces';

export class PamCheckRequest extends InfinityPayHttpClient {
  private amount_column = 'amount';

  constructor(vendorForm: any, amount_column: string) {
    super();
    this.amount_column = amount_column;
    this.setMethod(RequestMethodEnum.PAM_CHECK)
      .setParams({ vendor_form: vendorForm })
      .setIsLog(true);
  }

  getVendorForm() {
    const response: PamResponse | null = this.getResponse();

    const arrayForm: Record<string, any> = {
      static_amount: 0,
    };

    const result = response?.result ?? [];

    for (const item of result) {
      if (item?.vendor_form) {
        for (const vendorForm of item.vendor_form) {
          arrayForm['static_amount'] =
            vendorForm.key == this.amount_column ? vendorForm.value : 0;
          arrayForm[vendorForm.key] = vendorForm.value;
        }
      }
    }

    return { vendor_info: result[0].additional_form, vendor_form: arrayForm };
  }

  getAdditionalForm() {
    const response: PamResponse | null = this.getResponse();
    const result = response?.result ?? [];

    return result[0].additional_form;
  }
}
