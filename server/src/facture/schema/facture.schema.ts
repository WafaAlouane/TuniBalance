import { Schema, Document } from 'mongoose';
import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';

@NestSchema()
export class Transaction {
  @Prop()
  montant: number;

  @Prop()
  date_transaction: Date;

  @Prop()
  mode_paiement: string;

  @Prop()
  statut: string;
}

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
}

export type FactureDocument = Facture & Document;
export const FactureSchema = SchemaFactory.createForClass(Facture);
