import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import infinityConfig from '../../common/config/infinity.config';
import { InfinityPayGateService } from './infinity-pay-gate.service';

@Module({
  imports: [ConfigModule.forFeature(infinityConfig)],
  providers: [InfinityPayGateService],
  exports: [InfinityPayGateService],
})
export class InfinityPayModule {}
