import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { FactureModule } from 'src/facture/facture.module';
import { FiscalModule } from 'src/fiscal/fiscal.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    forwardRef(() => FactureModule),
  ],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [MongooseModule,TransactionsService], // Ensure MongooseModule is exported
})
export class TransactionsModule {}