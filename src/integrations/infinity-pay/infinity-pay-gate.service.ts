import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  PamCategoryVendorsRequest,
  PamCheckPaymentRequest,
  PamCheckRequest,
  PamConfirmPayRequest,
  PamGetCategoriesRequest,
  PamGetChequeDetailsRequest,
  PamGetFiscalDetailsRequest,
  PamGetVendorFormRequest,
  PamGetVendorRequest,
  PamP2PInfoRequest,
  PamPayByCashRequest,
  PamPayByIdRequest,
  PamPreparePayByIdRequest,
  PamPreparePayRequest,
  PamSendSmsRequest,
} from './requests';

import { PamPrepareRequestDto, PamPayByIdRequestDto } from '../dto';

@Injectable()
export class InfinityPayGateService {
  private readonly logger = new Logger(InfinityPayGateService.name);

  // ---------------------------- PAY BY CASH ------------------------------
  async payByCash(vendorForm: any) {
    const request = new PamPayByCashRequest(vendorForm);
    const response = await request.send();

    if (!response.isOk()) {
      throw new BadRequestException({
        message: response.getMessage(),
        code: response.getErrorCode(),
      });
    }
    return response.getDetails();
  }

  // ---------------------------- PAY INFO ------------------------------
  async payInfo(vendorForm: any, amount_column: string) {
    const request = new PamCheckRequest(vendorForm, amount_column);
    const response = await request.send();

    if (!response.isOk()) {
      throw new BadRequestException({
        message: response.getMessage(),
        code: response.getErrorCode(),
      });
    }
    return response.getVendorForm();
  }

  // ---------------------------- PAY BY CARD ------------------------------
  async payPrepare(preparePay: PamPrepareRequestDto) {
    const request = new PamPreparePayRequest(preparePay);
    const response = await request.send();

    if (!response.isOk()) {
      throw new BadRequestException({
        message: response.getMessage(),
        code: response.getErrorCode(),
      });
    }
    return response.getConfirmParams();
  }

  async sendSms(payerPhone: string, message: string) {
    const request = new PamSendSmsRequest(payerPhone, message);
    const response = await request.send();

    if (!response.isOk()) {
      throw new BadRequestException({
        message: response.getMessage(),
        code: response.getErrorCode(),
      });
    }
    return response.getResponse();
  }

  async payConfirm(confirmCode: string, bankTransId: string) {
    const request = new PamConfirmPayRequest(confirmCode, bankTransId);
    const response = await request.send();

    if (!response.isOk()) {
      throw new BadRequestException({
        message: response.getMessage(),
        code: response.getErrorCode(),
      });
    }

    return response.getDetails();
  }

  // ---------------------------- PAY BY ID ------------------------------
  async payById(requestData: PamPayByIdRequestDto) {
    const request = new PamPayByIdRequest(requestData);
    const response = await request.send();

    if (!response.isOk()) {
      throw new BadRequestException({
        message: response.getMessage(),
        code: response.getErrorCode(),
      });
    }

    return response.getDetails();
  }

  async preparePayById(requestData: PamPayByIdRequestDto) {
    const request = new PamPreparePayByIdRequest(requestData);
    const response = await request.send();

    if (!response.isOk()) {
      throw new BadRequestException({
        message: response.getMessage(),
        code: response.getErrorCode(),
      });
    }

    return response.getDetails();
  }

  async resendSms() {
    try {
    } catch (error) {}
  }

  // ---------------------------- PAY DETAILS ------------------------------
  async payCheckStatus(transactionId: number) {
    const request = new PamCheckPaymentRequest(transactionId);
    const response = await request.send();

    if (!response.isOk()) {
      throw new BadRequestException({
        message: response.getMessage(),
        code: response.getErrorCode(),
      });
    }
    return response.getResponse();
  }

  async getChequeDetails(partnerTransactionId: string) {
    const request = new PamGetChequeDetailsRequest(partnerTransactionId);
    const response = await request.send();

    if (!response.isOk()) {
      throw new BadRequestException({
        message: response.getMessage(),
        code: response.getErrorCode(),
      });
    }
    return response.getResponse();
  }

  async getFiscalDetails(partnerTransactionId: string) {
    const request = new PamGetFiscalDetailsRequest(partnerTransactionId);
    const response = await request.send();

    if (!response.isOk()) {
      throw new BadRequestException({
        message: response.getMessage(),
        code: response.getErrorCode(),
      });
    }
    return response.getResult();
  }

  // ---------------------------- PAM SERVICE ------------------------------
  async getCategories() {
    const request = new PamGetCategoriesRequest();
    const response = await request.send();

    if (!response.isOk()) {
      throw new BadRequestException({
        message: response.getMessage(),
        code: response.getErrorCode(),
      });
    }
    return response.getCategories();
  }

  async getCategoryVendors(categoryId: number) {
    const request = new PamCategoryVendorsRequest(categoryId);
    const response = await request.send();

    if (!response.isOk()) {
      throw new BadRequestException({
        message: response.getMessage(),
        code: response.getErrorCode(),
      });
    }
    return response.getVendors();
  }

  async getVendorById(vendorId: number) {
    const request = new PamGetVendorRequest(vendorId);
    const response = await request.send();

    if (!response.isOk()) {
      throw new BadRequestException({
        message: response.getMessage(),
        code: response.getErrorCode(),
      });
    }
    return response.getVendor();
  }

  async getVendorForm(vendorId: number) {
    const request = new PamGetVendorFormRequest(vendorId);
    const response = await request.send();

    if (!response.isOk()) {
      throw new BadRequestException({
        message: response.getMessage(),
        code: response.getErrorCode(),
      });
    }
    return response.getVendorForm();
  }
}
