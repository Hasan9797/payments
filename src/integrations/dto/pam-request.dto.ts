import { IsString, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PayFormDto {
  @IsString()
  card_number: string;

  @IsString()
  card_expire: string;
}

class PayPrepareByIdPayFormDto {
  @IsString()
  card_id: string;
}

export class PamPrepareRequestDto {
  @IsObject()
  vendor_form: any;

  @IsObject()
  @ValidateNested()
  @Type(() => PayFormDto)
  pay_form: PayFormDto;
}

export class PamPreparePayByIdRequestDto {
  @IsObject()
  vendor_form: any;

  @IsObject()
  @ValidateNested()
  @Type(() => PayPrepareByIdPayFormDto)
  pay_form: PayPrepareByIdPayFormDto;
}

export class QRRequestDto {
  @IsNumber()
  s_id: number;

  @IsString()
  p_acc: string;
}
