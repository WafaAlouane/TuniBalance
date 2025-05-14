import { Module } from '@nestjs/common';
import { KpiService } from './kpi.service';
import { KpiController } from './kpi.controller';
import { FactureModule } from 'src/facture/facture.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { BilanModule } from 'src/bilan/bilan.module';

@Module({
  imports: [
    FactureModule, 
    TransactionsModule,
    BilanModule 
  ],
  providers: [KpiService],
  controllers: [KpiController]
})
export class KpiModule {}
