import { RequestMethodEnum } from "@/common/enums";
import { PamCheckPaymentResult } from "@/common/interfaces";
import { InfinityPayHttpClient } from "../http-client";

export class PamCheckPaymentRequest extends InfinityPayHttpClient {
    constructor(transactionId: number) {
        super();
        this.setMethod(RequestMethodEnum.PAM_CHECK_PAYMENT)
            .setParams({ partner_transaction_id: transactionId })
            .setIsLog(true);
    }

    getPartnerTransaction() {
        const result: PamCheckPaymentResult = this.getResult();

        return {
            bankTransactionId: result.bank_transaction_id,
            status: result.status,
            amount: result.amount,
            date: result.date,
        };
    }
}
