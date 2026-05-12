import { Controller, Query, Req } from '@nestjs/common';
import { Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('vendor')
export class VendorController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async findAll(@Query() query: any, @Req() req) {
    return this.transactionService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param() param: any) {
    return this.transactionService.getById(param.id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.transactionService.create(body);
  }

  @Put(':id')
  async update(@Param() param: any, @Body() updateVendorDto: any) {
    return this.transactionService.update(param.id, updateVendorDto);
  }

  @Delete(':id')
  async remove(@Param() param: any) {
    return this.transactionService.delete(param.id);
  }
}
