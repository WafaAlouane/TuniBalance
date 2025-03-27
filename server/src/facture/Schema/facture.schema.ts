import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FactureDocument = Facture & Document;

@Schema()
export class Facture {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, enum: ['vente', 'achat'] })
  type: string;

  @Prop({ required: true })
  montant: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: Object })
client: { nom: string; adresse: string; email: string };

@Prop({ required: true, type: Object })
fournisseur: { nom: string; adresse: string; email: string };

  @Prop({ required: false })
  specifications?: string;
}

export const FactureSchema = SchemaFactory.createForClass(Facture);