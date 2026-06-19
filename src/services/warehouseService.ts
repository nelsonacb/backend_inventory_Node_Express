import { prisma } from '../../lib/prisma';
import logger from '../utils/logger';

export const getAllWarehouses = async (page?: number, limit?: number) => {
  if (page && limit) {
    const skip = (page - 1) * limit;
    const [data, total] = await prisma.$transaction([
      prisma.warehouse.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      prisma.warehouse.count(),
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
  return prisma.warehouse.findMany();
};

export const getWarehouseById = async (id: number) => {
  const warehouse = await prisma.warehouse.findUnique({ where: { id } });
  if (!warehouse) throw new Error('Almacén no encontrado');
  return warehouse;
};

export const createWarehouse = async (name: string, location?: string) => {
  const warehouse = await prisma.warehouse.create({
    data: { name, location },
  });
  logger.info(`Almacén creado: ${name}`);
  return warehouse;
};

export const updateWarehouse = async (
  id: number,
  name: string,
  location?: string,
) => {
  const updated = await prisma.warehouse.update({
    where: { id },
    data: { name, location },
  });
  logger.info(`Almacén actualizado: ID ${id}`);
  return updated;
};

export const deleteWarehouse = async (id: number) => {
  await prisma.warehouse.delete({ where: { id } });
  logger.info(`Almacén eliminado: ID ${id}`);
};
