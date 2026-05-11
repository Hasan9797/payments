import { RequestMethodEnum } from '@/common/enums';
import { InfinityPayHttpClient } from '../http-client';

export class PamGetVendorRequest extends InfinityPayHttpClient {
  constructor(vendorId: number) {
    super();
    this.setMethod(RequestMethodEnum.PAM_GET_VENDOR_BY_ID)
      .setParams({
        vendor_id: vendorId,
      })
      .setIsLog(false);
  }

  getVendor() {
    const result = this.getResult();
    return result.vendor_info;
  }
}
