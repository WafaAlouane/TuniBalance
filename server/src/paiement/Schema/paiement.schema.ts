import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Paiement extends Document {
  @Prop({ required: true })
  emprunt_id: string;

  @Prop({ required: true })
  date_paiement: string;

  @Prop({ required: true })
  montant_total: number;

  @Prop({ required: true })
  montant_interet: number;

  @Prop({ required: true })
  montant_amortissement: number;

  @Prop({ required: true })
  capital_restant_du: number;

  @Prop({ required: true })
  mode_paiement: string;

  @Prop({ required: true })
  justificatif: string;
}

export type PaiementDocument = Paiement & Document;
export const PaiementSchema = SchemaFactory.createForClass(Paiement);
