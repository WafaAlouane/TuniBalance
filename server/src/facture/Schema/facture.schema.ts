import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Transaction } from 'src/transactions/schema/transaction.schema';

@NestSchema()
export class Facture {
  @Prop({ required: true })
  numero_facture: string;

  @Prop({ required: true })
  nom_client: string;

  @Prop({ required: true })
  date_emission: Date;

  @Prop({ required: true })
  date_echeance: Date;

  @Prop({ required: true })
  montant_total: number;

  @Prop({ required: true })
  montant_paye: number;

  @Prop({ required: true })
  statut: string;

  @Prop({ required: true })
  mode_paiement: string;

  @Prop({ type: [Transaction], default: [] })
  transactions: Transaction[];

  @Prop({ required: true })
  type_facture: string;

  @Prop({ required: true })
  tva: number; // TVA applied to the total amount

  @Prop({ required: true })
  montant_ttc: number; // Total amount including TVA (montant_total + tva)
}

export type FactureDocument = Facture & Document;
export const FactureSchema = SchemaFactory.createForClass(Facture);