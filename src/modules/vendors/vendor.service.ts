import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateVendorDto, UpdateVendorDto } from './dto/create-update.dto';
import { GetVendorsDto } from './dto/get-vendor.dto';
import { paginate } from 'src/common/helpers/paginate';

@Injectable()
export class VendorService {
    private readonly logger = new Logger(VendorService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    // ─── Create ──────────────────────────────────────────────────────────────────

    async createVendor(data: CreateVendorDto) {
        this.logger.log(`Creating vendor with vendorId: ${data.vendorId}`);

        // Prisma unique constraint xatosi (P2002) ni ushlaymiz —
        // avvalgi findUnique + create pattern race condition uchun xavfli edi.
        return this.prisma.vendor.create({ data }).catch((err) => {
            if (err?.code === 'P2002') {
                throw new ConflictException(`Vendor with vendorId ${data.vendorId} already exists`);
            }
            throw err;
        });
    }

    // ─── Read ─────────────────────────────────────────────────────────────────────

    async getVendors(query: GetVendorsDto) {
        this.logger.log('Fetching vendors');

        return paginate('vendor', {
            page: query.page,
            size: query.size,
            filter: query.filters,
            sort: query.sort,
            // categoryId berilgan bo'lsa where ga qo'shamiz
            ...(query.categoryId && {
                where: { categoryId: query.categoryId },
            }),
        });
    }

    async getVendorById(id: number) {
        this.logger.log(`Fetching vendor id=${id} with forms`);

        // Avval 2 ta alohida query bor edi. Endi bitta query bilan include qilinadi.
        const vendor = await this.prisma.vendor.findUnique({
            where: { id },
            include: { vendorForms: true },
        });

        if (!vendor) throw new NotFoundException(`Vendor with id=${id} not found`);

        return vendor;
    }

    async getByVendorId(vendorId: number) {
        this.logger.log(`Fetching vendor vendorId=${vendorId}`);

        const vendor = await this.prisma.vendor.findUnique({
            where: { vendorId },
            include: {
                vendorForms: {
                    where: { amountType: { not: null } },
                },
            },
        });

        if (!vendor) throw new NotFoundException(`Vendor with vendorId=${vendorId} not found`);

        return vendor;
    }

    // ─── Update ───────────────────────────────────────────────────────────────────

    async updateVendor(id: number, data: UpdateVendorDto) {
        // vendor mavjudligini tekshirib, so'ngra update qilamiz
        await this.getVendorById(id);
        this.logger.log(`Updating vendor id=${id}`);

        return this.prisma.vendor.update({ where: { id }, data });
    }

    // ─── Delete ───────────────────────────────────────────────────────────────────

    async deleteVendor(id: number) {
        await this.getVendorById(id);
        this.logger.log(`Deleting vendor id=${id}`);

        return this.prisma.vendor.delete({ where: { id } });
    }
}
