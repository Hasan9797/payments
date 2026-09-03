import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsIn, IsInt, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { OperatorTypes, PaginationOptionalDto } from 'src/common/enums/prisma.type';
import { prisma } from 'src/common/helpers/paginate';

const vendorFormFields = Object.keys(prisma.vendorForm.fields);

class VendorFormFilter {
    @IsIn(vendorFormFields)
    @ApiProperty({ enum: vendorFormFields })
    column: string;

    @IsEnum(OperatorTypes)
    @ApiProperty({ enum: OperatorTypes })
    operator: OperatorTypes;

    @IsString()
    @ApiProperty({ type: String })
    value: string;
}

class VendorFormSort {
    @ApiProperty({ enum: vendorFormFields })
    @IsIn(vendorFormFields)
    column: string;

    @IsEnum(Prisma.SortOrder)
    @ApiProperty({ enum: Prisma.SortOrder })
    value: Prisma.SortOrder;
}

export class GetVendorFormDto extends PaginationOptionalDto {
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VendorFormFilter)
    @ApiProperty({ type: VendorFormFilter, isArray: true, required: false })
    filters?: VendorFormFilter[];

    @IsOptional()
    @ValidateNested()
    @Type(() => VendorFormSort)
    @ApiProperty({ type: VendorFormSort, required: false })
    sort?: VendorFormSort;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @ApiProperty({ type: Number, required: false, description: 'Filter by vendorId (external)' })
    vendorId?: number;
}