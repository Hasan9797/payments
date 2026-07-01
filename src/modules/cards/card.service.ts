import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InfinityPayGateService } from '@/integrations/infinity-pay/infinity-pay-gate.service';

@Injectable()
export class CardService {
  private readonly logger = new Logger(CardService.name);
  constructor(private readonly payGate: InfinityPayGateService) {}

  async getAll(query: any) {
    try {
      // transaction = await this.transactionService.create({});
    } catch (error: any) {
      throw new HttpException(error, error.status);
    }
  }

  async getById(id: number) {}

  async getByCardId(cardId: string) {}

  async getCardToken(cardId: string) {}

  async addCard(data: any) {}

  async updateCard(data: any, id: number) {}

  async deleteCard(id: number) {}
}
