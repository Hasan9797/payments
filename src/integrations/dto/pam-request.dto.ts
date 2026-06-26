import { IsString, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PayFormDto {
  @IsString()
  card_number: string;

  @IsString()
  card_expire: string;
}

export class PamPayByIdRequestDto {
  @IsNumber()
  user_id: number;

  @IsObject()
  vendor_form: any;

  @IsString()
  card_id?: string;

  @IsString()
  card_token?: string;
}
