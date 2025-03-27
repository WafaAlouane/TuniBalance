import { IsEnum, IsNotEmpty, IsNumber, IsString, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFactureDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsEnum(['vente', 'achat'])
  type: string;

  @IsNotEmpty()
  @IsNumber()
  montant: number;

  @IsNotEmpty()
@Type(() => Date) // Convertit la chaîne en Date
@IsDate()
date: Date;


  @IsNotEmpty()
  client: {
    nom: string;
    adresse: string;
    email: string;
  };

  @IsNotEmpty()
  fournisseur: {
    nom: string;
    adresse: string;
    email: string;
  };

  @IsOptional()
  @IsString()
  specifications?: string;
}
