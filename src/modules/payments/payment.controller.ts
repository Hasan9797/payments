import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { GetCategoryDto } from '../categories/dto/get-category.dto';
import { PamPrepareDto, QRRequestDto } from '../../integrations/dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  // -------------- Pay Info --------------
  @Post('pay-info')
  payCheck(@Body() vendor_form: any) {
    return this.paymentService.payInfo(vendor_form);
  }

  // -------------- Pay By Card --------------
  @Post('pay-prepare')
  payPrepare(@Body() body: PamPrepareDto) {
    return this.paymentService.payPrepare(body);
  }

  @Post('pay-confirm')
  async payConfirm(@Body() body: any) {
    return await this.paymentService.payConfirm(
      body.confirm_code,
      body.transaction_id,
    );
  }

  // -------------- Fincor Pay --------------
  @Post('fincor-pay')
  async payByCash(@Body() body: QRRequestDto, @Req() req) {
    return await this.paymentService.fincorPay(body);
  }

  // -------------- Pay Details --------------
  @Post('get-cheque-details')
  async getChequeDetails(@Body() body: any) {
    return await this.paymentService.getChequeDetails(body.transaction_id);
  }

  @Post('get-fiscal-details')
  async getFiscalDetails(@Body() body: any) {
    return await this.paymentService.getFiscalDetails(body.transaction_id);
  }

  @Post('pay-check-status')
  payInfo(@Body() body: any) {
    return this.paymentService.payCheckStatus(body.transaction_id);
  }

  //-------------------- Test services ---------------------
  @Get('get-categories')
  getCategories(@Query() query: GetCategoryDto) {
    return this.paymentService.getCategories();
  }

  @Post('get-category-vendors')
  getCategoryVendor(@Body() body: any) {
    return this.paymentService.getCategoryVendors(body.categoryId);
  }

  @Post('get-vendo-form')
  getVendorform(@Body() body: any) {
    return this.paymentService.getVendorFrom(body.vendorId);
  }
}
