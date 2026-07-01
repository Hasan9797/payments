import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { VendorFormModule } from './modules/vendor-forms/vendor-form.module';
import { PaymentModule } from './modules/payments/payment.module';
import { VendorModule } from './modules/vendors/vendor.module';
import { CardModule } from './modules/cards/card.module';
import { CategoryModule } from './modules/categories/category.module';

@Module({
  imports: [
    PrismaModule,
    PaymentModule,
    VendorModule,
    VendorFormModule,
    CardModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
