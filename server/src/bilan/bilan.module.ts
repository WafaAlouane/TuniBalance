import { Module } from '@nestjs/common';
import { BilanService } from './bilan.service';
import { BilanController } from './bilan.controller';

@Module({
  controllers: [BilanController],
  providers: [BilanService],
})
export class BilanModule {}
