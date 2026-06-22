import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InfinityPayGateService } from '@/integrations/infinity-pay/infinity-pay-gate.service';
import { TransactionService } from '../transactions/transaction.service';
import {
  PamPrepareRequestDto,
  PamPayByIdRequestDto,
} from '../../integrations/dto';
import { VendorFormService } from '../vendor-forms/vendor-form.service';
import { VendorService } from '../vendors/vendor.service';
import {
  TransactionStatus,
  TransactionType,
} from '@/common/enums/transaction.emum';

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
  async payPrepare(pamPrepareDto: PamPrepareRequestDto, userId: number = 2) {
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
        status: TransactionStatus.SUCCESS,
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
  async payById(params: any, lang: any) {
    const transaction = await this.transactionService.getById(
      params.transaction_id,
    );

    if (!transaction || !transaction.bankTransactionId) {
      throw new HttpException(
        'Transaction or bank transaction not found for confirm pay: ',
        404,
      );
    }
  }

  async preparePayById(params: any, lang: any) {
    const payload = {};

    try {
      const currentTransaction = await this.transactionService.existsByParams({
        account: params.invoice_number,
        status: TransactionStatus.SUCCESS,
      });

      if (currentTransaction) {
        throw new HttpException(
          'Транзакция завершена. Пожалуйста, ожидайте закрытия заявки',
          400,
        );
      }

      const response = await this.payGate.preparePayById(payload);

      const transaction = await this.transactionService.create({
        id: params.transaction_id,
        amount: params.amount,
        account: params.invoice_number,
        total: params.amount,
        cardId: params.card_id,
        cardNumber: params.card_number,
        vendorId: params.vendor_id,
        bankTransactionId: response.bank_transaction_id,
        source: params.source,
        status: TransactionStatus.PENDING,
        type: params.type,
        request: JSON.stringify(payload),
        response: JSON.stringify(response),
      });

      return {
        ...response,
        transaction_id: transaction.id,
      };
    } catch (error: any) {
      if (error.status == -2 || error.message == 'timeout of 100ms exceeded') {
        await this.transactionService.update(params.transaction_id, {
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
        status: TransactionStatus.SUCCESS,
      });

      if (currentTransaction) {
        throw new HttpException(
          'Транзакция завершена. Пожалуйста, ожидайте закрытия заявки',
          400,
        );
      }

      if (params.amount > 1000000) {
        return await this.preparePayById(payload, lang);
      } else {
        return await this.payById(payload, lang);
      }
    } catch (error: any) {
      if (error.status == -2 || error.message == 'timeout of 100ms exceeded') {
        await this.transactionService.update(params.transaction_id, {
          status: TransactionStatus.FAILED,
        });
      }
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
