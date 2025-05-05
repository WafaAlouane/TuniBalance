import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Emprunt extends Document {
  @Prop({ required: true })
  intitule: string;

  @Prop({ type: Date, required: true })
  date_debut: Date;

  @Prop({ required: true, type: Number })
  montant: number;

  @Prop({ required: true, type: Number })
  taux_interet: number;

  @Prop({ required: true, type: Number })
  duree: number;

  @Prop({ enum: ['constant', 'annuite_constante'], required: true })
  type_amortissement: 'constant' | 'annuite_constante';

  @Prop({ enum: ['mensuel', 'trimestriel', 'annuel'], required: true })
  frequence_paiement: 'mensuel' | 'trimestriel' | 'annuel';

  @Prop({ required: true })
  banque: string;
}

export const EmpruntSchema = SchemaFactory.createForClass(Emprunt);
