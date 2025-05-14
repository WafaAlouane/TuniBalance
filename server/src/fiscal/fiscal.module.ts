import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportingFiscalController } from './reporting-fiscal/reporting-fiscal.controller';
import { ReportingFiscalService } from './reporting-fiscal/reporting-fiscal.service';
import { FactureModule } from 'src/facture/facture.module';
import { BilanModule } from 'src/bilan/bilan.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { Bilan, BilanSchema } from 'src/bilan/schema/bilan.schema';
import { Facture, FactureSchema } from 'src/facture/Schema/facture.schema';
import { Transaction, TransactionSchema } from 'src/transactions/schema/transaction.schema';
import { TransactionsService } from 'src/transactions/transactions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Facture.name, schema: FactureSchema },
      { name: Bilan.name, schema: BilanSchema },
      { name: Transaction.name, schema: TransactionSchema }
    ]),
    FactureModule,
    BilanModule,
    TransactionsModule,
  ],
  controllers: [ReportingFiscalController],
  providers: [ReportingFiscalService, TransactionsService],
  exports: [ReportingFiscalService]
})
export class FiscalModule {}