import { forwardRef, Logger, Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { InfinityPayModule } from '../../integrations/infinity-pay/infinitypay.module';

@Module({
  imports: [InfinityPayModule],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
