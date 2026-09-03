import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto, UpdateVendorDto } from './dto/create-update.dto';
import { GetVendorsDto } from './dto/get-vendor.dto';
import { ParamById } from './dto/param-by-id.dto';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get()
  findAll(@Query() query: GetVendorsDto) {
    return this.vendorService.getVendors(query);
  }

  @Get(':id')
  findOne(@Param() param: ParamById) {
    return this.vendorService.getVendorById(param.id);
  }

  @Post()
  create(@Body() dto: CreateVendorDto) {
    return this.vendorService.createVendor(dto);
  }

  @Put(':id')
  update(@Param() param: ParamById, @Body() dto: UpdateVendorDto) {
    return this.vendorService.updateVendor(param.id, dto);
  }

  @Delete(':id')
  remove(@Param() param: ParamById) {
    return this.vendorService.deleteVendor(param.id);
  }
}
