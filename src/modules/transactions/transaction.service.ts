import { Injectable, Logger } from '@nestjs/common';
import { VendorService } from '../vendors/vendor.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { TransactionStatus } from '@/common/enums/transaction.emum';

interface ExistsParamsDto {
  account?: string;
  type?: string;
  status: TransactionStatus;
}

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

  async existsByParams(params: ExistsParamsDto): Promise<boolean> {
    const count = await this.prisma.transaction.count({
      where: params,
    });

    return count > 0;
  }

  async create(data: any) {
    return await this.prisma.transaction.create({ data });
  }

  async update(id: number, data: any) {
    return await this.prisma.transaction.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return await this.prisma.transaction.delete({ where: { id } });
  }
}
