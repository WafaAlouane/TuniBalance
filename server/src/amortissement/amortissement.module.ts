import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AmortissementService } from './amortissement.service';
import { AmortissementController } from './amortissement.controller';
import { Amortissement, AmortissementSchema } from './Schema/amortissement.schema';
import { Immobilisation, ImmobilisationSchema } from 'src/immobilisation/Schema/immobilisation.schema';
import { Emprunt, EmpruntSchema } from 'src/emprunt/Schema/emprunt.schema';
import { EmpruntModule } from 'src/emprunt/emprunt.module'; // <-- importer le module

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Amortissement.name, schema: AmortissementSchema },
      { name: Immobilisation.name, schema: ImmobilisationSchema },
      { name: Emprunt.name, schema: EmpruntSchema },
    ]),
    EmpruntModule, // <-- ici
  ],
  controllers: [AmortissementController],
  providers: [AmortissementService],
})
export class AmortissementModule {}
