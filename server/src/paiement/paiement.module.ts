import { Module } from '@nestjs/common';
import { PaiementController } from './paiement.controller';
import { PaiementService } from './paiement.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Paiement, PaiementSchema } from './Schema/paiement.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Paiement.name, schema: PaiementSchema }])],
  controllers: [PaiementController],
  providers: [PaiementService],
})
export class PaiementModule {}
