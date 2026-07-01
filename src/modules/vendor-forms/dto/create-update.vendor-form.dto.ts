import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsEnum,
  IsNumber,
  IsJSON,
} from 'class-validator';

enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class CreateVendorFormDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  labelRu?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  labelEn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  labelUz?: string;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  element?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  value?: string;

  @ApiProperty()
  @IsInt()
  show: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mask?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prefix?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  regex?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  placeholder?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  size?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  isRequired?: number;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  options?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  amountType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString() // ✅ number emas, String — Prisma modelda String?
  minAmount?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString() // ✅ number emas, String — Prisma modelda String?
  maxAmount?: string;

  @ApiProperty()
  @IsInt()
  vendorId: number;
}
export class UpdateVendorFormDto {
  @ApiPropertyOptional({ description: 'Unique identifier for the vendor' })
  @IsOptional()
  @IsNumber()
  vendor_id?: number;

  @ApiPropertyOptional({ required: false, description: 'Name of the vendor' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ required: false, description: 'URL of the vendor' })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({ required: false, description: 'Logo of the vendor' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({
    required: false,
    description: 'Status of the vendor',
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({
    required: false,
    description: 'Description of the vendor',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    required: false,
    description: 'Category ID of the vendor',
  })
  @IsOptional()
  @IsNumber()
  category_id?: number;

  @ApiPropertyOptional({
    description: 'Russian name of the vendor',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_ru?: string;

  @ApiPropertyOptional({
    description: 'Uzbek name of the vendor',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_uz?: string;

  @ApiPropertyOptional({
    description: 'English name of the vendor',
    required: false,
  })
  @IsOptional()
  @IsString()
  name_en?: string;

  @ApiProperty({ description: 'Short name of the vendor' })
  @IsString()
  short_name: string;

  @ApiPropertyOptional({
    description: 'Uzbek short name of the vendor',
    required: false,
  })
  @IsOptional()
  @IsString()
  short_name_uz?: string;

  @ApiPropertyOptional({
    description: 'Russian short name of the vendor',
    required: false,
  })
  @IsOptional()
  @IsString()
  short_name_ru?: string;

  @ApiPropertyOptional({
    description: 'English short name of the vendor',
    required: false,
  })
  @IsOptional()
  @IsString()
  short_name_en?: string;

  @ApiProperty({
    description: 'Prophylaxis value of the vendor',
    required: false,
  })
  @IsInt()
  @IsOptional()
  prophylaxis?: number;
}
