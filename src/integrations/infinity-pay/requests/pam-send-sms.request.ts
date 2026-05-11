import { RequestMethodEnum } from '@/common/enums';
import { InfinityPayHttpClient } from '../http-client';

export class PamSendSmsRequest extends InfinityPayHttpClient {
    constructor(payerPhone: string, message: string) {
        super();
        this.setMethod(RequestMethodEnum.PAM_SEND_SMS)
            .setParams({
                phone: payerPhone,
                message
            })
            .setIsLog(false);
    }
}