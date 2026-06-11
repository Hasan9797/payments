import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateVendorDto, UpdateVendorDto } from './dto/create-update.dto';
import { GetVendorsDto } from './dto/get-vendor.dto';

@Injectable()
export class VendorService {
    private readonly logger = new Logger(VendorService.name)

    constructor(
        private prisma: PrismaService,
    ) { }

    async createVendor(data: CreateVendorDto) {
        let vendor = await this.prisma.vendor.findUnique({
            where: {
                vendor_id: data.vendor_id
            }
        })

        this.logger.log({ vendor });

        if (vendor) throw new ForbiddenException('Vendor_id already exists')

        this.logger.log('Creating a new vendor');
        return this.prisma.vendor.create({
            data,
        });
    }

    async getVendors(query: GetVendorsDto) {

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

    async getVendorById(id: number) {
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
        return this.prisma.vendor.findFirst({
            where: { vendor_id: vendorId }, include: {
                vendorForms: {
                    where: {
                        amount_field: {
                            not: null
                        }
                    }
                }
            }
        });
    }

    async updateVendor(id: number, data: UpdateVendorDto) {
        await this.getVendorById(id)
        this.logger.log(`Updating vendor with id: ${id}`);
        return this.prisma.vendor.update({
            where: { id },
            data,
        });
    }

    async deleteVendor(id: number) {
        await this.getVendorById(id)
        this.logger.log(`Deleting vendor with id: ${id}`);
        return this.prisma.vendor.delete({
            where: { id },
        });
    }

    async reload(id: number) {
        let category = await this.prisma.category.findUnique({
            where: {
                id: id
            }
        })

        if (!category) {
            throw new NotFoundException('Category not found')
        }

        let vendors = await this.vendorService.getCategoryVendors(category.key)
        for (const vendor of vendors) {
            await this.prisma.vendor.upsert({
                where: {
                    vendor_id: vendor?.vendor_id
                },
                create: {
                    logo: vendor.logo,
                    name: vendor.name,
                    short_name: vendor.short_name,
                    url: vendor.url,
                    status: vendor.status == 1 ? Status.ACTIVE : Status.INACTIVE,
                    vendor_id: vendor.vendor_id,
                    category_id: category.key,
                    description: vendor.description,
                    name_ru: vendor.name_ru,
                    name_uz: vendor.name_uz,
                    name_en: vendor.name_en,
                    short_name_ru: vendor.short_name_ru,
                    short_name_en: vendor.short_name_uz,
                    short_name_uz: vendor.short_name_en
                },
                update: {
                    logo: vendor.logo,
                    name: vendor.name,
                    url: vendor.url,
                    short_name: vendor.short_name,
                    status: vendor.status == 1 ? Status.ACTIVE : Status.INACTIVE,
                    vendor_id: vendor.vendor_id,
                    category_id: category.key,
                    description: vendor.description,
                    name_ru: vendor.name_ru,
                    name_uz: vendor.name_uz,
                    name_en: vendor.name_en,
                    short_name_ru: vendor.short_name_ru,
                    short_name_en: vendor.short_name_uz,
                    short_name_uz: vendor.short_name_en
                }
            })
        }

        return {
            message: "Successfully"
        }
    }


}
