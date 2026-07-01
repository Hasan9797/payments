import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsIn, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";