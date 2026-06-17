import { RequestMethodEnum } from '@/common/enums';
import { InfinityPayHttpClient } from '../http-client';
import { PamPreparePayByIdRequestDto } from '@/integrations/dto/pam-request.dto';

export class PamPreparePayByIdRequest extends InfinityPayHttpClient {
  constructor(requestData: PamPreparePayByIdRequestDto) {
    super();

    this.setMethod(RequestMethodEnum.PAM_PREPARE_PAY_BY_ID)
      .setParams(requestData)
      .setIsLog(true);
  }

  getDetails() {
    const result: any = this.getResult();
    return result?.details;
  }
}
