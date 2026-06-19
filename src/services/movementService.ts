import { prisma } from '../../lib/prisma';
import logger from '../utils/logger';

export const createMovement = async (
  stockId: number,
  quantityChange: number,
  reason: string,
  notes: string | undefined,
  userId: number,
) => {
  return prisma.$transaction(
    async (tx: {
      stockMovement: {
        create: (arg0: {
          data: {
            stockId: number;
            quantityChange: number;
            reason: string;
            notes: string | undefined;
            createdBy: number;
          };
        }) => any;
      };
      stock: {
        update: (arg0: {
          where: { id: number };
          data: { quantity: { increment: number } };
        }) => any;
      };
      product: { findUnique: (arg0: { where: { id: any } }) => any };
      alert: {
        create: (arg0: {
          data: { productId: any; warehouseId: any; message: string };
        }) => any;
      };
    }) => {
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
      logger.info(
        `Movimiento registrado: ${reason} ${quantityChange} unidades`,
      );
      return movement;
    },
  );
};

export const getMovements = async (page?: number, limit?: number) => {
  const include = {
    stock: { include: { product: true, warehouse: true } },
    user: true,
  };
  const orderBy = { date: 'desc' as const };

  if (page && limit) {
    const skip = (page - 1) * limit;
    const [data, total] = await prisma.$transaction([
      prisma.stockMovement.findMany({
        include,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.stockMovement.count(),
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
  return prisma.stockMovement.findMany({ include, orderBy });
};
