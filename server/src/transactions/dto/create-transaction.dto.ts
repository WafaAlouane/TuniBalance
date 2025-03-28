import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsMongoId } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @IsNotEmpty()
  date: Date;

  @IsEnum(['Dépense', 'Recette', 'Transfert'])
  type: string;

  @IsNumber()
  @IsNotEmpty()
  montant: number;

  @IsEnum(['TND', 'EUR', 'USD'])
  devise: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  categorie: string;

  @IsEnum(['Espèces', 'Virement', 'Chèque', 'Carte bancaire'])
  mode_paiement: string;

  @IsEnum(['En attente', 'Validée', 'Refusée'])
  statut: string;

  @IsMongoId()
  compte_debite_id: string;

  @IsMongoId()
  compte_credite_id: string;

  @IsString()
  @IsOptional()
  justificatif_url?: string;

  @IsMongoId()
  cree_par_user_id: string;

  @IsNumber()
  @IsOptional()
  taux_tva?: number;
}
