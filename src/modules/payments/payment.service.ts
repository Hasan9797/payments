import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PayGateService } from './pay-gate.service';
import { TransactionService } from '../transaction/transaction.service';
import { PamPrepareDto } from '../../integrations/dto';
import { VendorFormService } from '../vendor-forms/vendor-form.service';
import { VendorService } from '../vendors/vendor.service';
import { TransactionType } from '@/common/enums/transaction.emum';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    private readonly payGate: PayGateService,
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
        //   status: TransactionType.PROCESS,
        // });
      } else {
        // await this.transactionService.update(transaction.id, {
        //   status: TransactionType.ERROR,
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
    const payInfo = await this.payGate.payInfo(
      vendorForm,
      vendor.vendorForms[0]?.amount_field,
    );

    return { ...payInfo, vendor };
  }

  // ---------------------------- PAY BY CARD ------------------------------
  async payPrepare(pamPrepareDto: PamPrepareDto, userId: number = 2) {
    const vendor = await this.vendorService.getByVendorId(
      Number(pamPrepareDto.vendor_form.vendor_id),
    );
    let vendorForm = await this.vendorFormService.getByVendorId(
      Number(pamPrepareDto.vendor_form.vendor_id),
    );
    let amount_field = 'amount';

    if (vendorForm.length > 0) {
      amount_field = vendorForm.find(
        (item: any) => item.amount_field,
      )?.amount_field;
    }

    if (pamPrepareDto.vendor_form.static_amount > 0) {
      pamPrepareDto.vendor_form[amount_field] = Number(
        pamPrepareDto.vendor_form.static_amount,
      );
    }

    const transaction = await this.transactionService.create({
      user_id: userId,
      amount: Number(pamPrepareDto.vendor_form[amount_field]),
      vendor_id: Number(pamPrepareDto.vendor_form.vendor_id),
    });

    if (!transaction) throw new HttpException('Transaction not created', 500);

    const response = await this.payGate.payPrepare(pamPrepareDto);

    await this.transactionService.update(transaction.id, {
      bank_transaction_id: response.bank_transaction_id,
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

      if (!transaction) {
        throw new HttpException('Transaction not found for confirm pay: ', 404);
      }

      const response = await this.payGate.payConfirm(
        confirmCode,
        transaction.bank_transaction_id,
      );

      await this.transactionService.update(transaction.id, {
        status: TransactionType.CONFIRM,
        partner_transaction_id: parseInt(response.transaction_id),
      });

      return { ...response, labbay_transaction_id: transaction.id };
    } catch (error) {
      if (error.status == -2 || error.message == 'timeout of 100ms exceeded') {
        await this.transactionService.update(transactionId, {
          status: TransactionType.PROCESS,
        });
      } else {
        await this.transactionService.update(transactionId, {
          status: TransactionType.ERROR,
        });
      }
      throw new HttpException(error, error.status);
    }
  }

  // ---------------------------- PAY DETAILS ------------------------------
  async getFiscalDetails(transactionId: number) {
    const transaction = await this.transactionService.getById(transactionId);
    return await this.payGate.getFiscalDetails(
      transaction.partner_transaction_id,
    );
  }

  async getChequeDetails(transactionId: number) {
    const transaction = await this.transactionService.getById(transactionId);
    return await this.payGate.getChequeDetails(
      transaction.partner_transaction_id,
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
