import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BilanService } from './bilan.service';
import { BilanController } from './bilan.controller';
import { Bilan, BilanSchema } from './schema/bilan.schema';
import { Transaction, TransactionSchema } from '../transactions/schema/transaction.schema';
import { Facture, FactureSchema } from '../facture/Schema/facture.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bilan.name, schema: BilanSchema },
      { name: Transaction.name, schema: TransactionSchema }, // Ajout du modèle Transaction
      { name: Facture.name, schema: FactureSchema },         // Ajout du modèle Facture
    ]),
  ],
  controllers: [BilanController],
  providers: [BilanService],
})
export class BilanModule {}
