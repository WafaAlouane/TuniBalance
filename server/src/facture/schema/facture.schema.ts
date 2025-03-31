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

  @Prop({ type: [String], default: [] }) // Stocke les transaction_id au lieu des _id
  transactions: string[];

  @Prop({ required: true })
type_facture: string; // or another appropriate type

}

export type FactureDocument = Facture & Document;
export const FactureSchema = SchemaFactory.createForClass(Facture);

