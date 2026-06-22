import { RequestMethodEnum } from '@/common/enums';
import { InfinityPayHttpClient } from '../http-client';
import { PamPayByIdRequestDto } from '@/integrations/dto/pam-request.dto';

export class PamPayByIdRequest extends InfinityPayHttpClient {
  constructor(requestData: PamPayByIdRequestDto) {
    super();

    this.setMethod(RequestMethodEnum.PAM_PAY_BY_ID)
      .setParams(requestData)
      .setIsLog(true);
  }

  getDetails() {
    const result: any = this.getResult();
    return result?.details;
  }
}
