import { ApiProperty } from "@nestjs/swagger"
import { Status } from "@prisma/client"
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateCategoryDto {
    @ApiProperty()
    @IsNumber()
    key: number

    @ApiProperty()
    @IsString()
    title: string

    @ApiProperty()
    @IsString()
    logo: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    order_no?: number

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    parent_id?: number
}

export class UpdateCategoryDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    key?: number

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    title?: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    logo?: string

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    order_no?: number

    @ApiProperty({ enum: Status, required: false })
    @IsOptional()
    @IsEnum(Status)
    status?: Status

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    parent_id?: number
}