import { Controller, Post, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Body, Delete, Get, Param, Put } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-update.category';
import { PaginationOptionalDto, ParamId } from 'src/common/enums/prisma.type';
import { GetCategoryDto } from './dto/get-category.dto';
import { PamCheckDto } from './dto/payment.dto';

@Controller('')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post('category')
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get('category')
  async findAll(@Query() query: GetCategoryDto) {
    return this.categoryService.findAll(query);
  }
  
  @Get('category/:id/sub')
  async findAllSubCategory(@Param() param: ParamId) {
    return this.categoryService.findAllSubCategory(+param.id);
  }

  @Get('category/:id')
  async findOne(@Param() param: ParamId) {
    return this.categoryService.findOne(param.id);
  }

  @Put('category/:id')
  async update(@Param() param: ParamId, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(param.id, updateCategoryDto);
  }

  @Delete('category/:id')
  async remove(@Param() param: ParamId) {
    return this.categoryService.remove(param.id);
  }

  // @Get('category/:id/vendors')
  // async getVendors(@Param() param: ParamId, @Query() query: PaginationOptionalDto) {
  //   return this.categoryService.getVendor(param.id, query);
  // }

  // @Post('payment/pam-check')
  // async createPamCheck(@Body() body: PamCheckDto) {
  //   return this.categoryService.pamCheck(body);
  // }

  // @Post('payment/create')
  // async createPayment(@Body() body: PamCheckDto) {
  //   return this.categoryService.createPayment(body);
  // }

}
