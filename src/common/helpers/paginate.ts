import { PrismaClient } from '@prisma/client';
import { OperatorTypes } from '../enums/prisma.type';

// Shared singleton PrismaClient — faqat field introspection uchun ishlatiladi.
// Asosiy so'rovlar uchun injectable PrismaService ishlatilsin.
export const prisma = new PrismaClient();

interface FilterItem {
  column: string;
  operator: OperatorTypes;
  value: string;
}

interface SortItem {
  column: string;
  value: 'asc' | 'desc';
}

interface PaginateOptions {
  page?: number;
  size?: number;
  filter?: FilterItem[];
  sort?: SortItem;
  where?: Record<string, any>;
  include?: Record<string, any>;
  select?: Record<string, any>;
}

/**
 * Generic Prisma paginator.
 * @param model  — Prisma model nomi (e.g. 'vendor', 'category')
 * @param options — Pagination, filter, sort, where, include parametrlari
 */
export async function paginate<T = any>(
  model: string,
  options: PaginateOptions,
): Promise<{ data: T[]; total: number; page: number; size: number; totalPages: number }> {
  const page = options.page ?? 1;
  const size = options.size ?? 20;
  const skip = (page - 1) * size;

  // Filter ni Prisma where formatiga o'giramiz
  const filterWhere: Record<string, any> = {};
  for (const f of options.filter ?? []) {
    if (f.operator === OperatorTypes.IN) {
      filterWhere[f.column] = { [f.operator]: f.value.split(',').map((v) => v.trim()) };
    } else {
      filterWhere[f.column] = { [f.operator]: f.value };
    }
  }

  const where = { ...filterWhere, ...(options.where ?? {}) };

  const orderBy = options.sort
    ? { [options.sort.column]: options.sort.value }
    : undefined;

  const client = prisma as any;
  const delegate = client[model];

  if (!delegate) {
    throw new Error(`Unknown Prisma model: "${model}"`);
  }

  const queryArgs: any = { where, skip, take: size };
  if (orderBy) queryArgs.orderBy = orderBy;
  if (options.include) queryArgs.include = options.include;
  if (options.select) queryArgs.select = options.select;

  const [data, total] = await Promise.all([
    delegate.findMany(queryArgs),
    delegate.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    size,
    totalPages: Math.ceil(total / size),
  };
}

