import { Injectable, HttpException, Logger, Inject } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { PamRequest, PamResponse } from '@/common/interfaces';
import { ConfigType } from '@nestjs/config';
import infinityConfig from '../../common/config/infinity.config';
import { RequestMethodEnum } from '@/common/enums';

@Injectable()
export class InfinityPayHttpClient {
  private response: PamResponse | null = null;
  private isLog = false;
  private method = '';
  private params = {};

  @Inject(infinityConfig.KEY)
  private readonly config: ConfigType<typeof infinityConfig>;

  setMethod(method: RequestMethodEnum): this {
    this.method = method;
    return this;
  }

  setParams(params: any): this {
    this.response = params;
    return this;
  }

  setIsLog(isLog: boolean): this {
    this.isLog = isLog;
    return this;
  }

  private getBaseUrl(): string {
    return this.config.baseUrl || '';
  }

  private generateToken(): string {
    const { serviceId, serviceKey } = this.config;

    if (!serviceId || !serviceKey || serviceKey.length < 32) {
      throw new HttpException('To‘lov tizimi sozlamalari noto‘g‘ri', 500);
    }

    const time = Math.floor(Date.now() / 1000);
    const hash = crypto
      .createHash('sha1')
      .update(serviceKey + time)
      .digest('hex');

    return `${serviceId}-${hash}-${time}`;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private getRequest(): PamRequest {
    return {
      id: this.generateId(),
      method: this.method,
      params: this.params,
    };
  }

  // !! Infinity Pay Api Request, only Post Method
  async send(userId = 0, extraHeaders: any = {}): Promise<this> {
    const requestPayload = this.getRequest();
    const baseUrl = this.getBaseUrl();

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      Cash: 'have',
      Auth: this.generateToken(),
      ...extraHeaders,
    };

    try {
      const res = await axios.post(baseUrl, requestPayload, {
        headers,
      });

      if (!res.data) {
        throw new HttpException('Response is empty', -2);
      }

      this.response = res.data;
    } catch (error: any) {
      throw new HttpException(error.message, error.status);
    } finally {
      if (this.isLog) {
        console.log('Request: ', this.getRequest());
        console.log('Response: ', this.getResponse());

        Logger.log({
          request: this.getRequest(),
          response: this.getResponse(),
          userId,
        });
      }
    }

    return this;
  }

  getResponse() {
    return this.response;
  }

  getResult() {
    return this.response?.result;
  }

  isOk(): boolean {
    return !!(this.response && !this.response?.error?.code);
  }

  getErrorCode() {
    return this.response?.error?.code ?? -1;
  }

  getMessage(): string {
    return this.response?.error?.message ?? 'Неизвестная ошибка';
  }
}
