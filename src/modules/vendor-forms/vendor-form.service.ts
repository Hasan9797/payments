import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { PayGateService } from '../payment/pay-gate.service';
import { CreateVendorFormDto, UpdateVendorFormDto } from './dto/create-update.vendor-form.dto';
import { paginate } from 'src/common/helpers/paginate';
import { GetVendorFormDto } from './dto/get-vendor-form.dto';
import { QRVendorParams } from '@interfaces';

@Injectable()
export class VendorFormService {
  private readonly logger = new Logger(VendorFormService.name);


  constructor(private prisma: PrismaService, private payGate: PayGateService) { }

  async createVendor(data: CreateVendorFormDto) {
    let vendor = await this.prisma.vendor.findUnique({
      where: {
        vendor_id: data.vendor_id
      }
    })

    this.logger.log({ vendor });

    if (vendor) throw new ForbiddenException('Vendor_id already exists')

    this.logger.log('Creating a new vendor');
    return this.prisma.vendorForm.create({
      data,
    });
  }

  async getVendorForms(query: GetVendorFormDto) {

    let vendors = await paginate('vendor', {
      page: query.page,
      size: query.size,
      filter: query.filters,
      where: {
        category: {
          id: query.categoryId
        }
      }
    })

    return vendors
  }

  async getById(id: number) {
    this.logger.log(`Fetching vendor with id: ${id} forms`);
    let vendor = await this.prisma.vendor.findFirst({ where: { id } })
    if (!vendor) throw new NotFoundException('Vendor not found')

    let vendorForms = await this.prisma.vendorForm.findMany({
      where: {
        vendor_id: vendor.vendor_id
      }
    })

    return {
      vendor: vendor,
      vendor_form: vendorForms
    }
  }

  async getByVendorId(vendorId: number) {
    this.logger.log(`Fetching vendor with id: ${vendorId}`);
    return this.prisma.vendorForm.findMany({ where: { vendor_id: vendorId } });
  }

  async updateVendor(id: number, data: UpdateVendorFormDto) {
    await this.getById(id)
    this.logger.log(`Updating vendor with id: ${id}`);
    return this.prisma.vendorForm.update({
      where: { id },
      data,
    });
  }

  async deleteVendor(id: number) {
    await this.getById(id)
    this.logger.log(`Deleting vendor with id: ${id}`);
    return this.prisma.vendorForm.delete({
      where: { id },
    });
  }


  async reloadForm(id: number) {
    let vendorData = await this.prisma.vendor.findUnique({
      where: {
        id: id,
        vendorForms: {
          some: {
            notChange: true
          }
        }
      }
    })

    if (!vendorData) {
      throw new NotFoundException('Category not found')
    }

    let vendor_forms = await this.payGate.getVendorForm(vendorData.vendor_id)

    for (const vendor of vendor_forms) {
      await this.prisma.vendorForm.upsert({
        where: {
          vendor_id_key: {
            key: vendor.key,
            vendor_id: vendorData.vendor_id
          }
        },
        create: {
          key: vendor.key,
          value: `${vendor.value}`,
          type: vendor.type,
          show: vendor.show,
          label: vendor.label,
          label_ru: vendor.label_ru,
          label_uz: vendor.label_uz,
          label_en: vendor.label_en,
          options: vendor.options,
          element: vendor.element,
          mask: vendor.mask,
          prefix: vendor.prefix,
          regex: vendor.regex,
          is_required: vendor.is_required,
          placeholder: vendor.placeholder,
          size: vendor.size,
          amount_type: vendor.amount_type,
          min_amount: vendor.min_amount,
          max_amount: vendor.max_amount,
          accaunt_field: vendor.accaunt_field,
          amount_field: vendor.amount_field,
          order: vendor.order,
          vendor_id: vendorData.vendor_id
        },
        update: {
          key: vendor.key,
          value: `${vendor.value}`,
          show: vendor.show,
          label: vendor.label,
          label_ru: vendor.label_ru,
          label_uz: vendor.label_uz,
          label_en: vendor.label_en,
          options: vendor.options,
          element: vendor.element,
          mask: vendor.mask,
          prefix: vendor.prefix,
          regex: vendor.regex,
          is_required: vendor.is_required,
          placeholder: vendor.placeholder,
          size: vendor.size,
          amount_type: vendor.amount_type,
          min_amount: vendor.min_amount,
          max_amount: vendor.max_amount,
          accaunt_field: vendor.accaunt_field,
          amount_field: vendor.amount_field,
          order: vendor.order,
          type: vendor.type,
        }
      })
    }

    return {
      message: "Successfully"
    }
  }

  async reloadCategoryVendorsForm(id: number) {
    let vendorsData = await this.prisma.vendor.findMany({
      where: {
        category: {
          id
        },
        vendorForms: {
          none: {
            notChange: true
          }
        }
      }
    })

    if (!vendorsData.length) {
      throw new NotFoundException('Category not found')
    }

    for (const vendorData of vendorsData) {
      let vendor_forms = await this.payGate.getVendorForm(vendorData.vendor_id)

      for (const vendor of vendor_forms) {
        await this.prisma.vendorForm.upsert({
          where: {
            vendor_id_key: {
              key: vendor.key,
              vendor_id: vendorData.vendor_id
            }
          },
          create: {
            key: vendor.key,
            value: `${vendor.value}`,
            type: vendor.type,
            show: vendor.show,
            label: vendor.label,
            label_ru: vendor.label_ru,
            label_uz: vendor.label_uz,
            label_en: vendor.label_en,
            options: vendor.options,
            element: vendor.element,
            mask: vendor.mask,
            prefix: vendor.prefix,
            regex: vendor.regex,
            is_required: vendor.is_required,
            placeholder: vendor.placeholder,
            size: vendor.size,
            amount_type: vendor.amount_type,
            min_amount: vendor.min_amount,
            max_amount: vendor.max_amount,
            accaunt_field: vendor.accaunt_field,
            amount_field: vendor.amount_field,
            order: vendor.order,
            vendor_id: vendorData.vendor_id
          },
          update: {
            key: vendor.key,
            value: `${vendor.value}`,
            show: vendor.show,
            label: vendor.label,
            label_ru: vendor.label_ru,
            label_uz: vendor.label_uz,
            label_en: vendor.label_en,
            options: vendor.options,
            element: vendor.element,
            mask: vendor.mask,
            prefix: vendor.prefix,
            regex: vendor.regex,
            is_required: vendor.is_required,
            placeholder: vendor.placeholder,
            size: vendor.size,
            amount_type: vendor.amount_type,
            min_amount: vendor.min_amount,
            max_amount: vendor.max_amount,
            accaunt_field: vendor.accaunt_field,
            amount_field: vendor.amount_field,
            order: vendor.order,
            type: vendor.type,
          }
        })
      }
    }

    return {
      message: "Successfully"
    }
  }

  async getParamsByVendorFormForPamCheck(qrVendor: QRVendorParams, pAcc: string) {
    const inputForms = await this.prisma.vendorForm.findMany({ where: { vendor_id: qrVendor.vendor_id } });

    return inputForms.reduce((acc, form) => {
      if (form.element === 'select') {
        acc[form.key] = form.options[0].value
        return acc
      }
      if (qrVendor.invoice.includes(form.key)) {
        acc[form.key] = pAcc
        return acc
      }
      acc[form.key] = form.value;
      return acc;
    }, {});
  }
}
