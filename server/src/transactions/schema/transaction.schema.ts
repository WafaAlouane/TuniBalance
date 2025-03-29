import { Schema, Document } from 'mongoose';
import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid'; 

@NestSchema()
export class Transaction {
  @Prop({ required: true, unique: true, default: () => uuidv4() }) 
  transaction_id: string;

  @Prop()
  montant: number;

  @Prop()
  date_transaction: Date;

  @Prop()
  mode_paiement: string;

  @Prop()
  statut: string;
}

export type TransactionDocument = Transaction & Document;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
