import { Module } from '@nestjs/common';
import { GestionImpotEtTaxesService } from './gestion-impot-et-taxes.service';
import { GestionImpotEtTaxesController } from './gestion-impot-et-taxes.controller';
import { Transaction } from 'sequelize';
import { TransactionSchema } from 'src/transactions/schema/transaction.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Facture, FactureSchema } from 'src/facture/Schema/facture.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema },{ name: Facture.name, schema: FactureSchema }]) 
  ],
  providers: [GestionImpotEtTaxesService],
  controllers: [GestionImpotEtTaxesController]
})
export class GestionImpotEtTaxesModule {}
