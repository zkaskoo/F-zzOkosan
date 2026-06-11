import { Module } from '@nestjs/common';
import { NlpService } from './nlp.service';
import { NlpController } from './nlp.controller';
import { UnitsModule } from '../units/units.module';

@Module({
  imports: [UnitsModule],
  controllers: [NlpController],
  providers: [NlpService],
  exports: [NlpService],
})
export class NlpModule {}
