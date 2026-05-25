import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentByIdDto {
  @IsString()
  order_id: string;

  @IsOptional()
  @IsString()
  user_id: string;

  @IsString()
  amount: string;

  @IsString()
  @IsOptional()
  invoice_number: string;

  @IsString()
  @IsOptional()
  car_number: string;

  @IsString()
  @IsOptional()
  source: string;

  @IsString()
  card_id: string;

  @IsString()
  @IsOptional()
  card_token: string;

  @IsString()
  @IsOptional()
  pPaid: string;

  @IsNumber()
  @IsOptional()
  pStatus: number;
}

export class CreatePaymentDto {
  @IsString()
  order_id: string;

  @IsString()
  @IsOptional()
  user_id: string;

  @IsString()
  amount: string;

  @IsString()
  card_number: string;

  @IsString()
  card_expire: string;
}

export class CreateCheckDto {
  @IsString()
  amount: string;

  @IsString()
  order_id: string;
}

export class ConfirmPayDto {
  @IsString()
  confirmation_code: string;

  @IsString()
  bank_transaction_id: string;

  @IsOptional()
  @IsString()
  user_id: string;

  @IsString()
  @IsOptional()
  order_id?: string;
}

export class FincorePayDto {
  @IsNumber()
  vendor_id: number;

  @IsString()
  account: string;

  @IsOptional()
  @IsString()
  purpose_text: string;

  @IsNumber()
  amount: number;

  @IsString()
  fincore_public_id: string;
}

export class ResendSmsDto {
  @IsString()
  bank_transaction_id: string;
}

export class FiscalDetailsDto {
  @IsString()
  transaction_id: string;
}

export class PamCheckUpdateDto {
  @IsString()
  order_id: string;

  @IsOptional()
  @IsString()
  invoice_number: string;

  @IsString()
  amount: string;

  @IsString()
  pPaid: string;
}

export class PamCheckUpdateEmiFinesDto {
  @IsString()
  orderId: string;

  @IsOptional()
  @IsString()
  invoiceNumber: string;

  @IsString()
  amount: string;

  @IsString()
  @IsOptional()
  pPaid: string;

  @IsNumber()
  @IsOptional()
  pStatus?: number;
}

export class PayStickerDto {
  @IsNumber()
  applicationId: number;
  @IsString()
  card_id: string;
  user_id: number;
}

export class PayForDrbNumberDto {
  @IsString()
  invoice_number: string;
  @IsOptional()
  @IsString()
  card_id: string;

  user_id: number;
}
