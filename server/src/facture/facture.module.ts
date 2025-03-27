import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Facture, FactureSchema } from './Schema/facture.schema';
import { FactureService } from './facture.service';
import { FactureController } from './facture.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Facture.name, schema: FactureSchema }])],
  controllers: [FactureController],
  providers: [FactureService],
})
export class FactureModule {}