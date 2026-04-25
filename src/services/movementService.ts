import { prisma } from '../../lib/prisma';
import logger from '../utils/logger';

export const createMovement = async (
  stockId: number,
  quantityChange: number,
  reason: string,
  notes: string | undefined,
  userId: number,
) => {
  return prisma.$transaction(async (tx) => {
    // Crear movimiento
    const movement = await tx.stockMovement.create({
      data: {
        stockId,
        quantityChange,
        reason,
        notes,
        createdBy: userId,
      },
    });
    // Actualizar stock
    const stock = await tx.stock.update({
      where: { id: stockId },
      data: { quantity: { increment: quantityChange } },
    });
    // Validar si stock bajo umbral
    const product = await tx.product.findUnique({
      where: { id: stock.productId },
    });
    if (product && stock.quantity < product.threshold) {
      await tx.alert.create({
        data: {
          productId: stock.productId,
          warehouseId: stock.warehouseId,
          message: `Stock bajo: ${product.name} tiene ${stock.quantity} unidades (umbral ${product.threshold})`,
        },
      });
    }
    logger.info(`Movimiento registrado: ${reason} ${quantityChange} unidades`);
    return movement;
  });
};

export const getMovements = async () => {
  return prisma.stockMovement.findMany({
    include: {
      stock: { include: { product: true, warehouse: true } },
      user: true,
    },
    orderBy: { date: 'desc' },
  });
};
