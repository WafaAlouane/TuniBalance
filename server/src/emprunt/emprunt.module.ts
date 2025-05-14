import { Module } from '@nestjs/common';
import { EmpruntService } from './emprunt.service';
import { EmpruntController } from './emprunt.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Emprunt, EmpruntSchema } from './Schema/emprunt.schema';
import { Paiement, PaiementSchema } from 'src/paiement/Schema/paiement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Emprunt.name, schema: EmpruntSchema },
      { name: Paiement.name, schema: PaiementSchema },
    ]),
  ],
  controllers: [EmpruntController],
  providers: [EmpruntService],
})
export class EmpruntModule {}
