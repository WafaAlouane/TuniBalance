import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Immobilisation, ImmobilisationSchema } from './Schema/immobilisation.schema';
import { ImmobilisationController } from './immobilisation.controller';
import { ImmobilisationService } from './immobilisation.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Immobilisation.name, schema: ImmobilisationSchema }]),
  ],
  controllers: [ImmobilisationController],
  providers: [ImmobilisationService],
  exports: [ImmobilisationService],
})
export class ImmobilisationModule {}
