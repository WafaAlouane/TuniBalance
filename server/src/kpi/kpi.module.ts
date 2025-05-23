import { Module } from '@nestjs/common';
import { KpiService } from './kpi.service';
import { KpiController } from './kpi.controller';
import { FactureModule } from 'src/facture/facture.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { BilanModule } from 'src/bilan/bilan.module';
import { FactureService } from 'src/facture/facture.service';
import { BilanService } from 'src/bilan/bilan.service';
import { TransactionsService } from 'src/transactions/transactions.service';

@Module({
  imports: [
    FactureModule, 
    TransactionsModule,
    BilanModule 
  ],
  providers: [KpiService,FactureService,BilanService,TransactionsService],
  controllers: [KpiController]
})
export class KpiModule {}
