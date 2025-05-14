import { Schema, Document } from 'mongoose';
import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
export enum TypeTransaction {
  CHARGE = 'Charge',
  PRODUIT = 'Produit',
}

export enum TypeCompteResultat {
  EXPLOITATION = 'Exploitation',
  FINANCIERE = 'Financière',
  EXCEPTIONNELLE = 'Exceptionnelle',
}

export enum SousCategorieCharge {
  ACHAT_MARCHANDISES = 'Achats de marchandises',
  VARIATION_STOCKS = 'Variation des stocks de marchandises',
  LOYER = 'Loyer',
  PUBLICITE = 'Publicité',
  IMPOTS_TAXES = 'Impôts et taxes',
  SALAIRES = 'Salaires et charges sociales',
  INTERETS_EMPRUNTS = 'Intérêts des emprunts',
  AMENDES = 'Amendes',
  REMPLACEMENT_MATERIEL = 'Frais remplacement matériel productif',
  IMPOT_BENEFICE = 'Impôt sur les bénéfices',
}

export enum SousCategorieProduit {
  VENTE_MARCHANDISES = 'Ventes de marchandises',
}
interface TransactionLine {
  sous_categorie: string;
  montant: number;
}
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
  @Prop({ required: true, enum: TypeTransaction })
  categorie: TypeTransaction;

  @Prop({ required: true, enum: TypeCompteResultat })
  type_CResultat: TypeCompteResultat;

  @Prop({ required: true, enum: [...Object.values(SousCategorieCharge), ...Object.values(SousCategorieProduit)] })
  sous_categorie: string;

  @Prop({ required: true, enum: ['Débit', 'Crédit'] }) // Correction: Ajout required
  compte: string;
  
  
}

export type TransactionDocument = Transaction & Document;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);