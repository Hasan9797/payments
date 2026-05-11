import { IsString, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PayFormDto {
  @IsString()
  card_number: string;

  @IsString()
  card_expire: string;
}

export class PamPrepareDto {
  @IsObject()
  vendor_form: any;

  @IsObject()
  @ValidateNested()
  @Type(() => PayFormDto)
  pay_form: PayFormDto;
}

export class QRRequestDto {
  @IsNumber()
  s_id: number;

  @IsString()
  p_acc: string;
}
