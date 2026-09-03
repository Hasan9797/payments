import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl, IsEnum, IsNumber } from 'class-validator';

export enum VendorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class CreateVendorDto {
  @ApiProperty({ description: 'External unique vendor identifier' })
  @IsNumber()
  vendorId: number;

  @ApiProperty({ description: 'Name of the vendor' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Uzbek name of the vendor' })
  @IsOptional()
  @IsString()
  nameUz?: string;

  @ApiPropertyOptional({ description: 'Russian name of the vendor' })
  @IsOptional()
  @IsString()
  nameRu?: string;

  @ApiPropertyOptional({ description: 'English name of the vendor' })
  @IsOptional()
  @IsString()
  nameEng?: string;

  @ApiProperty({ description: 'Short name of the vendor' })
  @IsString()
  shortName: string;

  @ApiPropertyOptional({ description: 'Uzbek short name of the vendor' })
  @IsOptional()
  @IsString()
  shortNameUz?: string;

  @ApiPropertyOptional({ description: 'Russian short name of the vendor' })
  @IsOptional()
  @IsString()
  shortNameRu?: string;

  @ApiPropertyOptional({ description: 'English short name of the vendor' })
  @IsOptional()
  @IsString()
  shortNameEn?: string;

  @ApiProperty({ description: 'Category ID (FK)' })
  @IsInt()
  categoryId: number;

  @ApiProperty({ description: 'Logo URL of the vendor' })
  @IsString()
  logo: string;

  @ApiPropertyOptional({ description: 'Vendor URL' })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({ description: 'Status of the vendor', enum: VendorStatus })
  @IsEnum(VendorStatus)
  status: string;
}

export class UpdateVendorDto {
  @ApiPropertyOptional({ description: 'External unique vendor identifier' })
  @IsOptional()
  @IsNumber()
  vendorId?: number;

  @ApiPropertyOptional({ description: 'Name of the vendor' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Uzbek name of the vendor' })
  @IsOptional()
  @IsString()
  nameUz?: string;

  @ApiPropertyOptional({ description: 'Russian name of the vendor' })
  @IsOptional()
  @IsString()
  nameRu?: string;

  @ApiPropertyOptional({ description: 'English name of the vendor' })
  @IsOptional()
  @IsString()
  nameEng?: string;

  @ApiPropertyOptional({ description: 'Short name of the vendor' })
  @IsOptional()
  @IsString()
  shortName?: string;

  @ApiPropertyOptional({ description: 'Uzbek short name of the vendor' })
  @IsOptional()
  @IsString()
  shortNameUz?: string;

  @ApiPropertyOptional({ description: 'Russian short name of the vendor' })
  @IsOptional()
  @IsString()
  shortNameRu?: string;

  @ApiPropertyOptional({ description: 'English short name of the vendor' })
  @IsOptional()
  @IsString()
  shortNameEn?: string;

  @ApiPropertyOptional({ description: 'Category ID (FK)' })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiPropertyOptional({ description: 'Logo URL of the vendor' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({ description: 'Vendor URL' })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({ description: 'Status of the vendor', enum: VendorStatus })
  @IsOptional()
  @IsEnum(VendorStatus)
  status?: string;
}