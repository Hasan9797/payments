import { Injectable, Logger } from '@nestjs/common';
import { VendorService } from '../vendors/vendor.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  constructor(
    private readonly vendorService: VendorService,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(query: any) {}

  async getById(id: number) {
    return this.prisma.transaction.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.transaction.create({ data });
  }

  async update(id: number, data: any) {}

  async delete(id: number) {}
}
