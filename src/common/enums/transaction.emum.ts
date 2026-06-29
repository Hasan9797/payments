export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum TransactionType {
  FINE = 'fine',
  INSURANCE = 'insurance',
  Tinting = 'tinting',
  EmiFines = 'emi_fines',
  Other = 'other',
  Sticker = 'sticker',
  DrbPurchase = 'drb_purchase',
}
