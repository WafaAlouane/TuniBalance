import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Immobilisation } from 'src/immobilisation/Schema/immobilisation.schema';
import { Emprunt } from 'src/emprunt/Schema/emprunt.schema';

@Schema()
export class Amortissement extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Immobilisation', required: false })
  immobilisation_id?: Types.ObjectId | Immobilisation;

  @Prop({ type: Types.ObjectId, ref: 'Emprunt', required: false })
  emprunt_id?: Types.ObjectId | Emprunt;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Number, required: true })
  montant_amortissement: number;

  @Prop({ type: Number, required: true })
  cumul_amortissement: number;

  @Prop({ type: Number, required: true })
  valeur_nette: number;

  @Prop({ type: String, enum: ['lineaire', 'degressif', 'variable'], required: true })
  type: 'lineaire' | 'degressif' | 'variable';

  @Prop({ type: String, enum: ['comptable', 'fiscal'], required: false })
  nature?: 'comptable' | 'fiscal'; // optionnel

  @Prop({ required: true })
  exercice: string;
}

export const AmortissementSchema = SchemaFactory.createForClass(Amortissement);
