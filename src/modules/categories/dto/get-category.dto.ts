import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsIn, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { OperatorTypes, PaginationOptionalDto } from "src/common/enums/prisma.type";
import { prisma } from "src/common/helpers/paginate";

const fields = Object.keys(prisma.category.fields); // qaysi table bo'lsa shu tableni nomi qo'yilishi kerak

class CategoryFilter {
    @IsIn(fields)
    @ApiProperty({ enum: fields })
    column: string;

    @IsEnum(OperatorTypes)
    @ApiProperty({ enum: OperatorTypes })
    operator: OperatorTypes;

    @IsString()
    @ApiProperty({ type: String })
    value: string;
}

class CategorySort {
    @ApiProperty({ enum: fields })
    @IsIn(fields)
    column: string;

    @IsEnum(Prisma.SortOrder)
    @ApiProperty({ enum: Prisma.SortOrder })
    value: Prisma.SortOrder;
}

export class GetCategoryDto extends PaginationOptionalDto {
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CategoryFilter)
    @ApiProperty({ type: CategoryFilter, isArray: true, required: false })
    filters?: CategoryFilter[];

    @IsOptional()
    @ValidateNested()
    @Type(() => CategorySort)
    @ApiProperty({ type: CategorySort, required: false })
    sort?: CategorySort;
}