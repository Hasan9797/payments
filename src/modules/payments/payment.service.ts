import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InfinityPayGateService } from '@/integrations/infinity-pay/infinity-pay-gate.service';
import { TransactionService } from '../transactions/transaction.service';
import { PamPayByIdRequestDto } from '../../integrations/dto';
import { VendorFormService } from '../vendor-forms/vendor-form.service';
import { VendorService } from '../vendors/vendor.service';
import {
  TransactionStatus,
  TransactionType,
} from '@/common/enums/transaction.emum';
import { VendorFormValidatorHelper } from '@/common/helpers/vendor-form-validate.helper';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    private readonly payGate: InfinityPayGateService,
    private readonly transactionService: TransactionService,
    private readonly vendorService: VendorService,
    private readonly vendorFormService: VendorFormService,
  ) {}

  async fincorPay(vendorFormData: any) {
    let transaction = null;
    let amount_field = 'amount';
    try {
      if (vendorFormData.static_amount > 0)
        vendorFormData[amount_field] = Number(vendorFormData.static_amount);

      // transaction = await this.transactionService.create({});
    } catch (error: any) {
      if (error.status == -2 || error.message == 'timeout of 100ms exceeded') {
        // await this.transactionService.update(transaction.id, {
        //   status: TransactionStatus.PENDING,
        // });
      } else {
        // await this.transactionService.update(transaction.id, {
        //   status: TransactionStatus.FAILED,
        // });
      }
      throw new HttpException(error, error.status);
    }
  }

  // ---------------------------- PAY INFO ------------------------------
  async payInfo(vendorForm: any) {
    const vendor = await this.vendorService.getByVendorId(
      parseInt(vendorForm.vendor_id),
    );
    const payInfo = await this.payGate.payInfo(vendorForm, 'saldo');

    return { ...payInfo, vendor };
  }

  // ---------------------------- PAY BY CARD ------------------------------
  async payPrepare(pamPrepareDto: PamPayByIdRequestDto, userId: number = 2) {
    const vendor = await this.vendorService.getByVendorId(
      Number(pamPrepareDto.vendor_form.vendor_id),
    );

    const transaction = await this.transactionService.create({
      user_id: userId,
      amount: pamPrepareDto.vendor_form.amount,
      vendor_id: Number(pamPrepareDto.vendor_form.vendor_id),
    });

    if (!transaction) throw new HttpException('Transaction not created', 500);

    const response = await this.payGate.payPrepare(pamPrepareDto);

    await this.transactionService.update(transaction.id, {
      status: TransactionStatus.PENDING,
      bankTransactionId: response.bank_transaction_id,
    });

    return {
      ...response,
      transaction_id: transaction.id,
      vendor,
    };
  }

  async payConfirm(confirmCode: string, transactionId: number) {
    try {
      const transaction = await this.transactionService.getById(transactionId);

      if (!transaction || !transaction.bankTransactionId) {
        throw new HttpException(
          'Transaction or bank transaction not found for confirm pay: ',
          404,
        );
      }

      const response = await this.payGate.payConfirm(
        confirmCode,
        transaction.bankTransactionId,
      );

      await this.transactionService.update(transaction.id, {
        status: TransactionStatus.CONFIRMED,
        partnerTransactionId: parseInt(response.transaction_id),
      });

      return {
        ...response,
        partner_transaction_id: response.transaction_id,
        transaction_id: transaction.id,
      };
    } catch (error: any) {
      if (error.status == -2 || error.message == 'timeout of 100ms exceeded') {
        await this.transactionService.update(transactionId, {
          status: TransactionStatus.PENDING,
        });
      } else {
        await this.transactionService.update(transactionId, {
          status: TransactionStatus.FAILED,
        });
      }
      throw new HttpException(error, error.status);
    }
  }

  // ---------------------------- PAY BY ID ------------------------------
  async payById(
    requestBody: PamPayByIdRequestDto,
    lang: any,
    extraData: any = {},
  ) {
    let transaction: any = {};
    try {
      const vendorForms = await this.vendorFormService.getByVendorId(
        requestBody.vendor_form.vendor_id,
      );

      if (vendorForms.length === 0) {
        throw new HttpException('Vendor forms not found', 404);
      }

      VendorFormValidatorHelper.validateForm(vendorForms, requestBody);

      transaction = await this.transactionService.create({
        amount: requestBody.vendor_form.amount,
        total: requestBody.vendor_form.amount,
        cardId: requestBody.card_id,
        user_id: requestBody.user_id,
        cardToken: requestBody.card_token,
        vendorId: requestBody.vendor_form.vendor_id,
        status: TransactionStatus.CREATED,
        request: JSON.stringify(requestBody),
        ...extraData,
      });

      const headers = {
        'Card-Token': requestBody.card_token,
        'Accept-Language': lang,
      };

      const response = await this.payGate.payById(requestBody, headers);

      await this.transactionService.update(transaction.id, {
        maskedPhone: response.masked_phone,
        partnerTransactionId: String(response.transaction_id),
        status: TransactionStatus.CONFIRMED,
        bankTransactionId: response.bank_transaction_id,
        response: JSON.stringify(response),
      });

      return {
        ...response,
        transaction_id: transaction.id,
      };
    } catch (error: any) {
      if (error.status == -2 || error.message == 'timeout of 100ms exceeded') {
        await this.transactionService.update(transaction.id, {
          status: TransactionStatus.FAILED,
        });
      }
      throw new HttpException(error, error.status);
    }
  }

  async preparePayById(
    requestBody: PamPayByIdRequestDto,
    lang: any,
    extraData: any = {},
  ) {
    let transaction: any = {};
    try {
      const vendorForms = await this.vendorFormService.getByVendorId(
        requestBody.vendor_form.vendor_id,
      );

      if (vendorForms.length === 0) {
        throw new HttpException('Vendor forms not found', 404);
      }

      VendorFormValidatorHelper.validateForm(vendorForms, requestBody);

      const headers = {
        'Accept-Language': lang,
      };

      transaction = await this.transactionService.create({
        amount: requestBody.vendor_form.amount,
        total: requestBody.vendor_form.amount,
        cardId: requestBody.card_id,
        user_id: requestBody.user_id,
        cardToken: requestBody.card_token,
        vendorId: requestBody.vendor_form.vendor_id,
        status: TransactionStatus.CREATED,
        request: JSON.stringify(requestBody),
        ...extraData,
      });

      const { result, bankTransactionId } = await this.payGate.preparePayById(
        requestBody,
        headers,
      );

      await this.transactionService.update(transaction.id, {
        maskedPhone: result.masked_phone_number,
        status: TransactionStatus.PENDING,
        bankTransactionId,
        response: JSON.stringify(result),
      });

      return {
        ...result,
        transaction_id: transaction.id,
      };
    } catch (error: any) {
      if (error.status == -2 || error.message == 'timeout of 100ms exceeded') {
        await this.transactionService.update(transaction.id, {
          status: TransactionStatus.FAILED,
        });
      }
      throw new HttpException(error, error.status);
    }
  }

  // ---------------------------- PAY FINES ------------------------------
  async payFines(params: any, lang: any) {
    const order_id = params.order_id;
    const fine_serial_letters = order_id.slice(0, 2);
    const rest_of_fine_number = order_id.slice(2);

    let payload: any = {
      vendor_form: {
        NDECREE: rest_of_fine_number,
        code: fine_serial_letters,
        amount: params.amount,
        vendor_id: 106331,
      },
      pay_form: {
        card_id: params.card_id,
      },
      type: TransactionType.FINE,
    };

    if (fine_serial_letters === 'MB') {
      payload.vendor_form = {
        payment_code: '01',
        INVOICE: params.invoice_number,
        amount: params.amount,
        vendor_id: 106329,
      };
    }

    try {
      const currentTransaction = await this.transactionService.existsByParams({
        account: params.invoice_number,
        status: TransactionStatus.CONFIRMED,
      });

      if (currentTransaction) {
        throw new HttpException(
          'Транзакция завершена. Пожалуйста, ожидайте закрытия заявки',
          400,
        );
      }

      const extraData: Record<string, any> = {
        carNumber: params.car_number,
        account: params.invoice_number,
        source: params.source,
      };

      if (params.amount > 1000000) {
        return await this.preparePayById(payload, lang, extraData);
      } else {
        return await this.payById(payload, lang, extraData);
      }
    } catch (error: any) {
      throw new HttpException(error, error.status);
    }
  }

  // ---------------------------- PAY STICKER ------------------------------
  async paySticker(params: any) {
    // return await this.payGate.paySticker(params.transaction_id);
  }

  // ---------------------------- PAY DRB ------------------------------
  async payDrbInfo(transactionId: number) {
    // return await this.payGate.payDrbInfo(transactionId);
  }

  async payDrb(params: any) {
    // return await this.payGate.payDrb(transactionId);
  }

  // ---------------------------- PAY DETAILS ------------------------------
  async getFiscalDetails(transactionId: number) {
    const transaction = await this.transactionService.getById(transactionId);
    if (!transaction || !transaction.partnerTransactionId)
      throw new HttpException('Transaction partner ID not found', 404);

    return await this.payGate.getFiscalDetails(
      transaction.partnerTransactionId,
    );
  }

  async getChequeDetails(transactionId: number) {
    const transaction = await this.transactionService.getById(transactionId);
    if (!transaction || !transaction.partnerTransactionId)
      throw new HttpException('Transaction partner ID not found', 404);

    return await this.payGate.getChequeDetails(
      transaction.partnerTransactionId,
    );
  }

  async payCheckStatus(transactionId: number) {
    return await this.payGate.payCheckStatus(transactionId);
  }

  // ----------------------- Test ------------------------
  async getCategories() {
    return await this.payGate.getCategories();
  }

  async getCategoryVendors(categoryId: number) {
    return await this.payGate.getCategoryVendors(categoryId);
  }

  async getVendorFrom(vendorId: number) {
    return await this.payGate.getVendorForm(vendorId);
  }
}
