import { forwardRef, Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { PaymentModule } from '../payments/payment.module';

@Module({
  imports: [
    forwardRef(() => PaymentModule)],
  controllers: [VendorController],
  providers: [VendorService],
  exports: [VendorService],
})
export class VendorModule { }
