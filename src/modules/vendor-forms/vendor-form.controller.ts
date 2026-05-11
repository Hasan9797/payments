import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { VendorFormService } from './vendor-form.service';
import { ParamId } from 'src/common/enums/prisma.type';
import { CreateVendorFormDto, UpdateVendorFormDto } from './dto/create-update.vendor-form.dto';
import { GetVendorFormDto } from './dto/get-vendor-form.dto';

@Controller('vendor-form')
export class VendorFormController {
  constructor(private readonly vendorFormService: VendorFormService) { }

  @Get()
  async findAll(@Query() query: GetVendorFormDto) {
    return this.vendorFormService.getVendorForms(query);
  }

  @Get(':id')
  async findOne(@Param() param: ParamId) {
    return this.vendorFormService.getById(param.id);
  }

  @Get(':id/forms')
  async findVendorForms(@Param() param: ParamId) {
    return this.vendorFormService.getByVendorId(param.id);
  }

  @Put('reload/:id')
  async reloadForm(@Param() param: ParamId) {
    return this.vendorFormService.reloadForm(param.id)
  }

  @Put('/reload-all')
  async reloadCategoryForm(@Query() param: ParamId) {
    return this.vendorFormService.reloadCategoryVendorsForm(param.id)
  }

  @Post()
  async create(@Body() createVendorDto: CreateVendorFormDto) {
    return this.vendorFormService.createVendor(createVendorDto);
  }

  @Put(':id')
  async update(@Param() param: ParamId, @Body() updateVendorDto: UpdateVendorFormDto) {
    return this.vendorFormService.updateVendor(param.id, updateVendorDto);
  }

  @Delete(':id')
  async remove(@Param() param: ParamId) {
    return this.vendorFormService.deleteVendor(param.id);
  }

 
}
