import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsIn, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { OperatorTypes, PaginationOptionalDto } from "src/common/enums/prisma.type";
import { prisma } from "src/common/helpers/paginate";

const vendorFields = Object.keys(prisma.vendor.fields); // qaysi table bo'lsa shu tableni nomi qo'yilishi kerak

class VendorFilter {
    @IsIn(vendorFields)
    @ApiProperty({ enum: vendorFields })
    column: string;

    @IsEnum(OperatorTypes)
    @ApiProperty({ enum: OperatorTypes })
    operator: OperatorTypes;

    @IsString()
    @ApiProperty({ type: String })
    value: string;
}

class VendorSort {
    @ApiProperty({ enum: vendorFields })
    @IsIn(vendorFields)
    column: string;

    @IsEnum(Prisma.SortOrder)
    @ApiProperty({ enum: Prisma.SortOrder })
    value: Prisma.SortOrder;
}

export class GetVendorsDto extends PaginationOptionalDto {
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VendorFilter)
    @ApiProperty({ type: VendorFilter, isArray: true })
    filters?: VendorFilter[];

    @IsOptional()
    @ValidateNested()
    @Type(() => VendorSort)
    @ApiProperty({ type: VendorFilter })
    sort?: VendorSort;

    @IsOptional()
    @ApiProperty({ type: String, required: false })
    @IsNumber()
    categoryId: number
}