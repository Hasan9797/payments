import { ApiProperty } from "@nestjs/swagger";
import { IsObject } from "class-validator";

export class PamCheckDto {
    @ApiProperty()
    @IsObject()
    vendor_form: object
}