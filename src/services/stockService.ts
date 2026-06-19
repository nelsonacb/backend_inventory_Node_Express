import { prisma } from '../../lib/prisma';
import logger from '../utils/logger';

export const getAllStocks = async (
  productId?: number,
  warehouseId?: number,
  page?: number,
  limit?: number,
) => {
  const where: any = {};
  if (productId) where.productId = productId;
  if (warehouseId) where.warehouseId = warehouseId;

  if (page && limit) {
    const skip = (page - 1) * limit;
    const [data, total] = await prisma.$transaction([
      prisma.stock.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
        include: { product: true, warehouse: true },
      }),
      prisma.stock.count({ where }),
    ]);
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  return prisma.stock.findMany({
    where,
    include: { product: true, warehouse: true },
  });
};

export const getStockById = async (id: number) => {
  const stock = await prisma.stock.findUnique({
    where: { id },
    include: { product: true, warehouse: true },
  });
  if (!stock) throw new Error('Stock no encontrado');
  return stock;
};

export const createOrUpdateStock = async (
  productId: number,
  warehouseId: number,
  quantity: number,
) => {
  const stock = await prisma.stock.upsert({
    where: { productId_warehouseId: { productId, warehouseId } },
    update: { quantity },
    create: { productId, warehouseId, quantity },
  });
  logger.info(
    `Stock actualizado: producto ${productId} almacén ${warehouseId} cantidad ${quantity}`,
  );
  return stock;
};

export const updateStock = async (id: number, quantity: number) => {
  const updated = await prisma.stock.update({
    where: { id },
    data: { quantity },
  });
  logger.info(`Stock ${id} actualizado a ${quantity}`);
  return updated;
};

export const deleteStock = async (id: number) => {
  await prisma.stock.delete({ where: { id } });
  logger.info(`Stock ${id} eliminado`);
};
