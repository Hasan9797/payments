import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { GetCategoryDto } from '../categories/dto/get-category.dto';
import { PamPrepareRequestDto } from '../../integrations/dto';
import { CreatePaymentByIdDto } from './dto/payment.dto';

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
  payPrepare(@Body() body: PamPrepareRequestDto) {
    return this.paymentService.payPrepare(body);
  }

  @Post('pay-confirm')
  async payConfirm(@Body() body: any) {
    return await this.paymentService.payConfirm(
      body.confirm_code,
      body.transaction_id,
    );
  }

  // -------------- Pay By ID --------------
  @Post('pay-by-id')
  async payById(@Body() body: any, @Headers('Accept-Language') lang: any) {
    return await this.paymentService.payById(body, lang);
  }

  @Post('prepare-pay-by-id')
  async preparePayById(
    @Body() body: any,
    @Headers('Accept-Language') lang: any,
  ) {
    return await this.paymentService.preparePayById(body, lang);
  }

  // -------------- Pay Fines --------------
  @Post('pay-fines')
  async payFines(
    @Body() params: CreatePaymentByIdDto,
    @Headers('Accept-Language') lang: any,
  ) {
    return await this.paymentService.payFines(params, lang);
  }

  // -------------- Pay Sticker --------------
  @Post('pay-sticker')
  async paySticker(@Body() body: any, @Req() req) {
    return await this.paymentService.paySticker(body);
  }

  // -------------- Pay DRB --------------
  @Post('pay-drb-info')
  async payDrbInfo(@Body() body: any) {
    return await this.paymentService.payDrbInfo(body.transaction_id);
  }

  @Post('pay-drb')
  async payDrb(@Body() body: any) {
    return await this.paymentService.payDrb(body.transaction_id);
  }

  // -------------- Fincor Pay --------------
  @Post('fincor-pay')
  async fincorPay(@Body() body: any, @Req() req) {
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
