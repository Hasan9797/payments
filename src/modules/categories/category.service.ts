import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-update.category';
import { paginate } from 'src/common/helpers/paginate';
import { GetCategoryDto } from './dto/get-category.dto';
import { PaginationOptionalDto } from 'src/common/enums/prisma.type';
import { Status } from '@prisma/client';
import { PamCheckDto } from './dto/payment.dto';
import { InfinityApiService } from '@http';
import { InsuranceConfig, QPS_BASE_URL, QPS_SERVICE_ID, QPS_SERVICE_KEY } from '@config';
import { RequestMethodEnum } from '@enums';

@Injectable()
export class CategoryService {
      private readonly logger = new Logger(CategoryService.name)
      constructor(
            private prisma: PrismaService,
            private http: InfinityApiService
      ) { }

      async create(data: CreateCategoryDto) {
            this.logger.log('Creating a new category');
            return await this.prisma.category.create({
                  data,
            });
      }

      async findAll(query: GetCategoryDto) {
            this.logger.log('Fetching all categories');
            let categories = await paginate('category', {
                  page: query.page,
                  size: query.size,
                  filter: query.filters,
                  sort: query.sort,
                  include: {
                        subcategory: true
                  }
            })

            return {
                  ...categories,
                  data: categories.data.map((el: any) => ({
                        ...el,
                        haveSubCategory: !el.subcategory
                  }))
            }
      }

      async findAllSubCategory(id: number) {
            let subcategories = await this.prisma.category.findMany({
                  where: {
                        parent_id: id
                  }
            })

            return subcategories
      }

      async findOne(id: number) {
            this.logger.log(`Fetching category with id: ${id}`);
            let category = this.prisma.category.findUnique({
                  where: { id, status: Status.ACTIVE },
                  include: {
                        subcategory: true
                  }
            });
            if (!category) throw new NotFoundException('Category id not found')
            return category
      }

      async update(id: number, data: UpdateCategoryDto) {
            await this.findOne(id)
            this.logger.log(`Updating category with id: ${id}`);
            return this.prisma.category.update({
                  where: { id },
                  data,
            });
      }

      async remove(id: number) {
            await this.findOne(id)
            this.logger.log(`Deleting category with id: ${id}`);
            return this.prisma.category.delete({
                  where: { id },
            });
      }

      async getVendor(id: number, query: PaginationOptionalDto) {
            let vendors = paginate('vendor', {
                  page: query.page,
                  size: query.size,
                  where: {
                        status: Status.ACTIVE,
                        category: {
                              id: id
                        }
                  }
            })

            return vendors
      }

      async getVendorForms(id: number) {
            let vendor = await this.prisma.vendor.findFirst({ where: { id } })
            let vendorForms = await this.prisma.vendorForm.findMany({
                  where: {
                        vendor_id: vendor.vendor_id
                  }
            })

            return {
                  vendor_form: vendorForms
            }
      }

      async pamCheck(body: PamCheckDto) {
            await this.http.setMethod(RequestMethodEnum.PAM_CHECK)
                  .setUrl(QPS_BASE_URL)
                  .setParams({ vendor_form: body.vendor_form })
                  .send();

            let response = this.http.getResponse()
            if (response.error) throw new BadRequestException(response.error.message)
            return {
                  additional_form: response.result[0].additional_form
            }
      }

      async createPayment(body: PamCheckDto) {
            console.log(body.vendor_form);

            await this.http.setMethod(RequestMethodEnum.PAM_PAY_BY_CASH)
                  .setUrl(QPS_BASE_URL)
                  .setParams({ vendor_form: body.vendor_form })
                  .send();

            let response = this.http.getResponse()
            if (response.error) throw new BadRequestException(response.error.message)

            return {
                  result: {
                        details: {
                              ...body.vendor_form,
                              ...response.result?.details
                        }
                  }
            }
      }
}
