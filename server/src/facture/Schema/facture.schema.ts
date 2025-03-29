import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Transaction } from '../../transactions/schema/transaction.schema';
export type FactureDocument = Facture & Document;

@Schema()
export class Facture {
  @Prop({ required: true, unique: true })
  numero_facture: string;

  @Prop({ required: true, enum: ['vente', 'achat'] })
  type: string;

  @Prop({ required: true })
  montant_total: number;

  @Prop({ required: true })
  montant_paye: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: Object })
client: { nom: string; adresse: string; email: string };

@Prop({ required: true, type: Object })
fournisseur: { nom: string; adresse: string; email: string };

@Prop({ type: Number })
taux_tva?: number;

  @Prop({ required: false })
  specifications?: string;
  @Prop({ type: [Transaction], default: [] })
  transactions: Transaction[];
}


export const FactureSchema = SchemaFactory.createForClass(Facture);