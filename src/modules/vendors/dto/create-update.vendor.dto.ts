import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl, IsEnum, IsNumber } from 'class-validator';

enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export class CreateVendorDto {
    @ApiProperty({ description: 'Unique identifier for the vendor' })
    @IsNumber()
    vendor_id: number;

    @ApiProperty({ description: 'Name of the vendor' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'URL of the vendor', required: false })
    @IsOptional()
    @IsUrl()
    url?: string;

    @ApiProperty({ description: 'Logo of the vendor' })
    @IsString()
    logo: string;

    @ApiProperty({ description: 'Status of the vendor', enum: Status })
    @IsEnum(Status)
    status: Status;

    @ApiPropertyOptional({ description: 'Description of the vendor', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Category ID of the vendor' })
    @IsNumber()
    category_id: number;

    @ApiPropertyOptional({ description: 'Russian name of the vendor', required: false })
    @IsOptional()
    @IsString()
    name_ru?: string;

    @ApiPropertyOptional({ description: 'Uzbek name of the vendor', required: false })
    @IsOptional()
    @IsString()
    name_uz?: string;

    @ApiPropertyOptional({ description: 'English name of the vendor', required: false })
    @IsOptional()
    @IsString()
    name_en?: string;

    @ApiProperty({ description: 'Short name of the vendor' })
    @IsString()
    short_name: string;

    @ApiPropertyOptional({ description: 'Uzbek short name of the vendor', required: false })
    @IsOptional()
    @IsString()
    short_name_uz?: string;

    @ApiPropertyOptional({ description: 'Russian short name of the vendor', required: false })
    @IsOptional()
    @IsString()
    short_name_ru?: string;

    @ApiPropertyOptional({ description: 'English short name of the vendor', required: false })
    @IsOptional()
    @IsString()
    short_name_en?: string;

    @ApiProperty({ description: 'Prophylaxis value of the vendor', required: false })
    @IsInt()
    @IsOptional()
    prophylaxis?: number;
}

export class UpdateVendorDto {
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

    @ApiPropertyOptional({ required: false, description: 'Status of the vendor', enum: Status })
    @IsOptional()
    @IsEnum(Status)
    status?: Status;

    @ApiPropertyOptional({ required: false, description: 'Description of the vendor' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ required: false, description: 'Category ID of the vendor' })
    @IsOptional()
    @IsNumber()
    category_id?: number;

    @ApiPropertyOptional({ description: 'Russian name of the vendor', required: false })
    @IsOptional()
    @IsString()
    name_ru?: string;

    @ApiPropertyOptional({ description: 'Uzbek name of the vendor', required: false })
    @IsOptional()
    @IsString()
    name_uz?: string;

    @ApiPropertyOptional({ description: 'English name of the vendor', required: false })
    @IsOptional()
    @IsString()
    name_en?: string;

    @ApiProperty({ description: 'Short name of the vendor' })
    @IsString()
    short_name: string;

    @ApiPropertyOptional({ description: 'Uzbek short name of the vendor', required: false })
    @IsOptional()
    @IsString()
    short_name_uz?: string;

    @ApiPropertyOptional({ description: 'Russian short name of the vendor', required: false })
    @IsOptional()
    @IsString()
    short_name_ru?: string;

    @ApiPropertyOptional({ description: 'English short name of the vendor', required: false })
    @IsOptional()
    @IsString()
    short_name_en?: string;

    @ApiProperty({ description: 'Prophylaxis value of the vendor', required: false })
    @IsInt()
    @IsOptional()
    prophylaxis?: number;
}