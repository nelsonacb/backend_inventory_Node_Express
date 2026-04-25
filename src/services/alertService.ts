import { prisma } from '../../lib/prisma';
import logger from '../utils/logger';

export const getAllAlerts = async () => {
  return prisma.alert.findMany({
    include: { product: true, warehouse: true },
    orderBy: { createdAt: 'desc' },
  });
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
