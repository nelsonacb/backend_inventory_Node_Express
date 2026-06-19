import { prisma } from '../../lib/prisma';
import logger from '../utils/logger';

export const getAllAlerts = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const [data, total] = await prisma.$transaction([
    prisma.alert.findMany({
      skip,
      take: limit,
      orderBy: { id: 'asc' },
      include: { product: true, warehouse: true },
    }),
    prisma.alert.count(),
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
};

export const getUnreadCount = async () => {
  return prisma.alert.count({ where: { isRead: false } });
};

export const markAsRead = async (id: number) => {
  const alert = await prisma.alert.update({
    where: { id },
    data: { isRead: true },
  });
  logger.info(`Alerta ${id} marcada como leída`);
  return alert;
};
