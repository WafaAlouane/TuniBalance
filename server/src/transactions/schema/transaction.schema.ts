import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: String, required: true, unique: true })
  transaction_id: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: String, enum: ['Dépense', 'Recette', 'Transfert'], required: true })
  type: string;

  @Prop({ type: Number, required: true })
  montant: number;

  @Prop({ type: String, enum: ['TND', 'EUR', 'USD'], required: true })
  devise: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String, required: true })
  categorie: string;

  @Prop({ type: String, enum: ['Espèces', 'Virement', 'Chèque', 'Carte bancaire'], required: true })
  mode_paiement: string;

  @Prop({ type: String, enum: ['En attente', 'Validée', 'Refusée'], required: true })
  statut: string;

  @Prop({ type: Types.ObjectId, ref: 'Compte', required: true })
  compte_debite_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Compte', required: true })
  compte_credite_id: Types.ObjectId;

  @Prop({ type: String })
  justificatif_url: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  cree_par_user_id: Types.ObjectId;

  @Prop({ type: Number })
  taux_tva?: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
