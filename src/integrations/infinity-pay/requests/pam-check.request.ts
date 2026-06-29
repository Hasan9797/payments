import { RequestMethodEnum } from '@/common/enums';
import { InfinityPayHttpClient } from '../http-client';
import { PamResponse } from '@/common/interfaces';

export class PamCheckRequest extends InfinityPayHttpClient {
  constructor(vendorForm: any) {
    super();
    this.setMethod(RequestMethodEnum.PAM_CHECK)
      .setParams({ vendor_form: vendorForm })
      .setIsLog(true);
  }

  getVendorForm() {
    const response: PamResponse | null = this.getResponse();
    const result = response?.result ?? [];

    const arrayForm: Record<string, any> = {};

    // Ma'lumotlarni obyektga kalit-qiymat (key-value) shaklida yig'amiz
    for (const item of result) {
      for (const vendorForm of item?.vendor_form ?? []) {
        arrayForm[vendorForm.key] = vendorForm.value;
      }
    }

    return {
      vendor_info: result[0]?.additional_form ?? null,
      vendor_form: arrayForm,
    };
  }

  getAdditionalForm() {
    const response: PamResponse | null = this.getResponse();
    const result = response?.result ?? [];

    return result[0].additional_form;
  }
}
