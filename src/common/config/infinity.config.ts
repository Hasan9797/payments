import { registerAs } from '@nestjs/config';

export default registerAs('infinityPay', () => ({
  baseUrl: process.env.QPS_BASE_URL,
  serviceId: process.env.QPS_SERVICE_ID,
  serviceKey: process.env.QPS_SERVICE_KEY,
  timeout: parseInt(process.env.QPS_TIMEOUT || '60', 10),
}));
