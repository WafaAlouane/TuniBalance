import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface BilanLine {
  sous_categorie: string;
  montant: number;
}

@NestSchema()
export class Bilan {
  @Prop({ required: true, unique: true })
  annee: number; // Année du bilan

  @Prop({ type: [{ sous_categorie: String, montant: Number }] })
  actifsCirculants: BilanLine[]; 

  @Prop({ type: [{ sous_categorie: String, montant: Number }] })
  actifsNonCirculants: BilanLine[];
  @Prop({ type: [{ sous_categorie: String, montant: Number }] })
  passifsEmprunts: BilanLine[]; 

  @Prop({ type: [{ sous_categorie: String, montant: Number }] })
  passifsDettes: BilanLine[]; 

  @Prop({ type: [{ sous_categorie: String, montant: Number }] })
  capitauxPropresDetails: BilanLine[]; 

  @Prop({ required: true, default: 0 })
  totalActifsCirculants: number; 

  @Prop({ required: true, default: 0 })
  totalActifsNonCirculants: number; 
  @Prop({ required: true, default: 0 })
  totalPassifsEmprunts: number; 

  @Prop({ required: true, default: 0 })
  totalPassifsDettes: number; 

  @Prop({ required: true, default: 0 })
  totalCapitauxPropres: number; 
}

export type BilanDocument = Bilan & Document;
export const BilanSchema = SchemaFactory.createForClass(Bilan);
