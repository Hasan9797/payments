import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { InfinityPayGateService } from '../../integrations/infinity-pay/infinitypay-gate.service';
import {
  CreateVendorFormDto,
  UpdateVendorFormDto,
} from './dto/create-update.vendor-form.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { GetVendorFormDto } from './dto/get-vendor-form.dto';

@Injectable()
export class VendorFormService {
  private readonly logger = new Logger(VendorFormService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly payGate: InfinityPayGateService,
  ) {}

  async createVendor(data: CreateVendorFormDto) {
    let vendor = await this.prisma.vendor.findUnique({
      where: {
        vendorId: data.vendorId,
      },
    });

    this.logger.log({ vendor });

    if (vendor) throw new ForbiddenException('Vendor_id already exists');

    this.logger.log('Creating a new vendor');
    return this.prisma.vendorForm.create({
      data,
    });
  }

  async getVendorForms(query: GetVendorFormDto) {
    const page = query.page || 1;
    const size = query.size || 10;
    const skip = (page - 1) * size;

    const [data, total] = await Promise.all([
      this.prisma.vendorForm.findMany({
        where: { vendorId: query.vendorId },
        skip,
        take: size,
        orderBy: { id: 'asc' },
      }),
      this.prisma.vendorForm.count({
        where: { vendorId: query.vendorId },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        size,
        lastPage: Math.ceil(total / size),
      },
    };
  }

  async getById(id: number) {
    this.logger.log(`Fetching vendor with id: ${id} forms`);
    let vendor = await this.prisma.vendor.findFirst({ where: { id } });
    if (!vendor) throw new NotFoundException('Vendor not found');

    let vendorForms = await this.prisma.vendorForm.findMany({
      where: {
        vendorId: vendor.vendorId,
      },
    });

    return {
      vendor: vendor,
      vendor_form: vendorForms,
    };
  }

  async getByVendorId(vendorId: number) {
    return this.prisma.vendorForm.findMany({ where: { vendorId } });
  }

  async updateVendor(id: number, data: UpdateVendorFormDto) {
    await this.getById(id);
    this.logger.log(`Updating vendor with id: ${id}`);
    return this.prisma.vendorForm.update({
      where: { id },
      data,
    });
  }

  async deleteVendor(id: number) {
    await this.getById(id);
    this.logger.log(`Deleting vendor with id: ${id}`);
    return this.prisma.vendorForm.delete({
      where: { id },
    });
  }

  async reloadForm(vendorId: number) {
    let vendorData = await this.prisma.vendor.findUnique({
      where: {
        id: vendorId,
      },
    });

    if (!vendorData) {
      throw new NotFoundException('Category not found');
    }

    let vendorForms = await this.payGate.getVendorForm(vendorData.vendorId);

    for (const vendor of vendorForms) {
      await this.prisma.vendorForm.upsert({
        where: {
          vendorId_key: {
            key: vendor.key,
            vendorId: vendorData.vendorId,
          },
        },
        create: {
          key: vendor.key,
          value: `${vendor.value}`,
          type: vendor.type,
          show: vendor.show,
          label: vendor.label,
          options: vendor.options,
          element: vendor.element,
          mask: vendor.mask,
          prefix: vendor.prefix,
          regex: vendor.regex,
          isRequired: vendor.is_required,
          placeholder: vendor.placeholder,
          size: vendor.size,
          amountType: vendor.amount_type,
          minAmount: vendor.min_amount,
          maxAmount: vendor.max_amount,
          order: vendor.order,
          vendorId: vendorData.vendorId,
        },
        update: {
          key: vendor.key,
          value: `${vendor.value}`,
          show: vendor.show,
          label: vendor.label,
          options: vendor.options,
          element: vendor.element,
          mask: vendor.mask,
          prefix: vendor.prefix,
          regex: vendor.regex,
          isRequired: vendor.is_required,
          placeholder: vendor.placeholder,
          size: vendor.size,
          amountType: vendor.amount_type,
          minAmount: vendor.min_amount,
          maxAmount: vendor.max_amount,
          order: vendor.order,
          type: vendor.type,
        },
      });
    }

    return {
      message: 'Successfully',
    };
  }

  async reloadVendorsFormByCategoryId(id: number) {
    let vendorsData = await this.prisma.vendor.findMany({
      where: { categoryId: id },
    });

    if (!vendorsData.length) {
      throw new NotFoundException('Category not found');
    }

    for (const vendorData of vendorsData) {
      let vendorForms = await this.payGate.getVendorForm(vendorData.vendorId);

      for (const vendor of vendorForms) {
        await this.prisma.vendorForm.upsert({
          // Biz kiritgan unikal kombinatsiya bo'yicha qidiramiz
          where: {
            vendorId_key: {
              vendorId: vendorData.vendorId,
              key: vendor.key,
            },
          },
          create: {
            key: vendor.key,
            value: vendor.value ? `${vendor.value}` : null,
            show: vendor.show,
            label: vendor.label,
            options: vendor.options as any, // Prisma Json turi uchun xatolik bermasligi uchun
            element: vendor.element,
            mask: vendor.mask,
            prefix: vendor.prefix,
            regex: vendor.regex,
            isRequired: vendor.is_required,
            placeholder: vendor.placeholder,
            size: vendor.size,
            amountType: vendor.amount_type,
            minAmount: vendor.min_amount ? `${vendor.min_amount}` : null,
            maxAmount: vendor.max_amount ? `${vendor.max_amount}` : null,
            order: vendor.order,
            type: vendor.type,
            vendorId: vendorData.vendorId,
          },
          update: {
            key: vendor.key,
            value: vendor.value ? `${vendor.value}` : null,
            show: vendor.show,
            label: vendor.label,
            options: vendor.options as any,
            element: vendor.element,
            mask: vendor.mask,
            prefix: vendor.prefix,
            regex: vendor.regex,
            isRequired: vendor.is_required,
            placeholder: vendor.placeholder,
            size: vendor.size,
            amountType: vendor.amount_type,
            minAmount: vendor.min_amount ? `${vendor.min_amount}` : null,
            maxAmount: vendor.max_amount ? `${vendor.max_amount}` : null,
            order: vendor.order,
            type: vendor.type,
          },
        });
      }
    }

    return {
      message: 'Successfully',
    };
  }

  async reloadCategoryVendorsForm(categoryId: number) {
    let categoryData = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });
  }
}
