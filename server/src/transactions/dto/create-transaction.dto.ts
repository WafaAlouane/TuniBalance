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

  @IsString()
  @IsNotEmpty()
  compte_debite: string; // Identifiant ou numéro du compte débité

  @IsString()
  @IsNotEmpty()
  compte_credite: string; // Identifiant ou numéro du compte crédité

  
  @IsMongoId()
  cree_par_user_id: string;

  @IsNumber()
  @IsOptional()
  taux_tva?: number;

  @IsMongoId()
  @IsOptional()
  facture_id?: string; // Référence à la facture
}
