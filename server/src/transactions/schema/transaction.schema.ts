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

  @Prop({ type: String, enum: ['Dépense', 'Recette'], required: true })
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

  @Prop({ type: String, enum: ['credit', 'debit'], required: true })
  compte: string; // Par exemple, un identifiant de compte
  @Prop({ type: String, required: true })
  compte_source: string;
  @Prop({ type: String, required: true })
  compte_dest: string;
   
  
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  cree_par_user_id: Types.ObjectId;



  @Prop({ type: Types.ObjectId, ref: 'Facture' })
  facture_id?: Types.ObjectId; // Référence à la facture
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
