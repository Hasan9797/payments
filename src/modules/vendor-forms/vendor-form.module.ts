import { forwardRef, Module } from '@nestjs/common';
import { VendorFormService } from './vendor-form.service';
import { VendorFormController } from './vendor-form.controller';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    PaymentModule
  ],
  controllers: [VendorFormController],
  providers: [VendorFormService],
  exports: [VendorFormService],
})
export class VendorFormModule {}
