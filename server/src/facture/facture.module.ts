import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FactureService } from './facture.service';
import { FactureController } from './facture.controller';
import { Facture, FactureSchema } from './Schema/facture.schema';
import { TransactionsModule } from '../transactions/transactions.module'; // Import the TransactionsModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Facture.name, schema: FactureSchema }]),
    forwardRef(() => TransactionsModule)
  ],
  providers: [FactureService],
  exports: [FactureService], 
  controllers: [FactureController],
})
export class FactureModule {}