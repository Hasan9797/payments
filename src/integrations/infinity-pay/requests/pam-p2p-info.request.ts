import { RequestMethodEnum } from '@/common/enums';
import { InfinityPayHttpClient } from '../http-client';

export class PamP2PInfoRequest extends InfinityPayHttpClient {
  private clientCardNumber: string;

  constructor(cardNumber: string) {
    super();
    this.clientCardNumber = cardNumber;
    this.setMethod(RequestMethodEnum.PAM_P2P_INFO)
      .setParams({
        card_number: cardNumber,
      })
      .setIsLog(false);
  }

  getCardInfo() {
    const result = this.getResult();
    const [last_name, first_name, ...middle] = result.name.trim().split(/\s+/);
    const middle_name = middle.join(' ') || 'xxx';

    return {
      cach2card: {
        partner_transaction_id: 0,
        card_number: this.clientCardNumber,
        amount: 0,
        sender: {
          first_name,
          last_name,
          middle_name,
        },
      },
      card_info: result,
    };
  }
}
