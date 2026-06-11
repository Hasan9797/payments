import { Controller, Query, Req } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CreateVendorDto, UpdateVendorDto } from './dto/create-update.dto';
import { GetVendorsDto } from './dto/get-vendor.dto';
import { ParamById } from './dto/param-by-id.dto';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get()
  async findAll(@Query() query: GetVendorsDto, @Req() req) {
    return this.vendorService.getVendors(query);
  }

  @Get(':id')
  async findOne(@Param() param: ParamById) {
    return this.vendorService.getVendorById(param.id);
  }

  @Get(':id/forms')
  async findVendorForms(@Param() param: ParamById) {
    return this.vendorService.getVendorById(param.id);
  }

  @Post()
  async create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.createVendor(createVendorDto);
  }

  @Put(':id')
  async update(@Param() param: ParamById, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorService.updateVendor(param.id, updateVendorDto);
  }

  @Delete(':id')
  async remove(@Param() param: ParamById) {
    return this.vendorService.deleteVendor(param.id);
  }

  @Put('reload/:id') 
  async reload(@Param() param: ParamById) {
    return this.vendorService.reload(param.id)
  }
}
