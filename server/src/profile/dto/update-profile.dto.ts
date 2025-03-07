// profile/dto/update-profile.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateProfileDto } from './create-profile.dto';
import { IsOptional } from 'class-validator';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @IsOptional()
  companyName?: string;

  @IsOptional()
  bio?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  location?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  companyCreationDate?: Date;
}