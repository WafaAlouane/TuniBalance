import { IsString, IsOptional, IsArray, IsUrl, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
export class CreateProfileDto {
  @ApiProperty()
  @IsString()
  companyName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value)) // Conversion de la string en Date
  companyCreationDate: Date;

  
}