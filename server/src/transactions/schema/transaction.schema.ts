import { Schema, Document } from 'mongoose';
import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@NestSchema()
export class Transaction {
  @Prop({ required: true, unique: true, default: () => uuidv4() })
  transaction_id: string;

  @Prop({ required: true })
  montant: number;

  @Prop({ required: true })
  date_transaction: Date;

  @Prop({ required: true })
  mode_paiement: string;

  @Prop({ required: true })
  statut: string;

  @Prop()
  description?: string;
  
  @Prop({ required: true, enum: ['Débit', 'Crédit'] }) // Correction: Ajout required
  compte: string;
  
  @Prop({ required: true, enum: ['Exploitation', 'Financière','Exceptionnelle'] }) 
  type_CResultat: string;
}

export type TransactionDocument = Transaction & Document;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
