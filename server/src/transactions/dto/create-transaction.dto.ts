import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsMongoId } from 'class-validator';
import { TypeTransaction, TypeCompteResultat, SousCategorieCharge, SousCategorieProduit } from '../schema/transaction.schema';

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  montant: number;

  @IsNotEmpty()
  date_transaction: Date;

  @IsString()
  @IsNotEmpty()
  mode_paiement: string;

  @IsString()
  @IsNotEmpty()
  statut: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TypeTransaction)
  @IsNotEmpty()
  categorie: TypeTransaction;

  @IsEnum(TypeCompteResultat)
  @IsNotEmpty()
  type_CResultat: TypeCompteResultat;

  @IsString()
  @IsNotEmpty()
  sous_categorie: string;

  @IsString()
  @IsNotEmpty()
  compte: string;
}
