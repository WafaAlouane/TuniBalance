import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Immobilisation extends Document {
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  categorie: string;

  @Prop({ type: Date, required: true })
  date_acquisition: Date;

  @Prop({ required: true })
  valeur_acquisition: number;

  @Prop({ required: true })
  duree_amortissement: number;

  @Prop({ enum: ['lineaire', 'degressif'], required: true })
  type_amortissement: 'lineaire' | 'degressif';

  @Prop()
  taux_amortissement?: number;

  @Prop()
  valeur_residuelle?: number;

  @Prop({ required: true })
  etat: string;

  @Prop({ required: true })
  fournisseur: string;

  @Prop({ required: true })
  compte_comptable: string;
}

export const ImmobilisationSchema = SchemaFactory.createForClass(Immobilisation);
