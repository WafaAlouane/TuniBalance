import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@NestSchema()
export class Bilan {
  @Prop({ required: true })
  date_bilan: Date;

  //Actif
  @Prop({ required: true })
  actif_immobilise: number;

  @Prop({ required: true })
  actif_circulant: number;

  @Prop({ required: true })
  total_actif: number;

  //Passif
  @Prop({ required: true })
  capitaux_propres: number;

  @Prop({ required: true })
  dettes: number;

  @Prop({ required: true })
  total_passif: number;
}

export type BilanDocument = Bilan & Document;
export const BilanSchema = SchemaFactory.createForClass(Bilan);
