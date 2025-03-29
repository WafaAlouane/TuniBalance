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

  @IsEnum(['credit', 'debit'])
    compte: string; 
    @IsString()
  @IsNotEmpty()
    compte_source: string;
    @IsString()
  @IsNotEmpty()
    compte_dest: string;
  @IsMongoId()
  cree_par_user_id: string;

  

  @IsMongoId()
  @IsOptional()
  facture_id?: string; // Référence à la facture
}
