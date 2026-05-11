import { forwardRef, Logger, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { InfinityPayModule } from '../../integrations/infinity-pay/infinity-pay.module';

@Module({
  imports: [InfinityPayModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
