export interface PamRequest {
  id: string;
  params: any;
  method: string;
}

export interface PamResponse {
  id: number;
  error: null | Error;
  result: any;
  mix_id?: string;
}

interface Error {
  code: number;
  message: string;
}

export interface PamVendor {
  id: number;
  key: string;
  value: number;
  name: string;
  name_ru: string;
  name_uz: string;
  name_en: string;
  short_name: string;
  short_name_ru: string;
  short_name_uz: string;
  short_name_en: string;
  url: string;
  logo: string;
  description: string;
  category_id: number;
  prophylaxis: number;
}

export interface PamCategory {
  id: number;
  key: string;
  value: number;
  title: string;
  logo: string;
  order_no: number;
}

export interface PamCheckPaymentResult {
  bank_transaction_id: number;
  status: number;
  amount: string;
  date: string;
}

export interface QRVendorParams {
  s_id: number;
  vendor_id: number;
  invoice: Array<string>;
}
