import { Module } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { Facture, FactureSchema } from '../facture/Schema/facture.schema';
import { FactureController } from 'src/facture/facture.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    MongooseModule.forFeature([{ name: Facture.name, schema: FactureSchema }]) // Ajouter le schéma de Facture ici
  ],
  controllers: [TransactionsController],
  providers: [TransactionService],
})
export class TransactionModule {}