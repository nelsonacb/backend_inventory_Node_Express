import { prisma } from '../../lib/prisma';
import logger from '../utils/logger';

export const getAllCategories = async () => {
  return prisma.category.findMany();
};

export const getCategoryById = async (id: number) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new Error('Categoría no encontrada');
  return category;
};

export const createCategory = async (name: string, color?: string) => {
  const category = await prisma.category.create({
    data: { name, color: color || '#007bff' },
  });
  logger.info(`Categoría creada: ${name}`);
  return category;
};

export const updateCategory = async (
  id: number,
  name: string,
  color?: string,
) => {
  const updated = await prisma.category.update({
    where: { id },
    data: { name, color },
  });
  logger.info(`Categoría actualizada: ID ${id}`);
  return updated;
};

export const deleteCategory = async (id: number) => {
  await prisma.category.delete({ where: { id } });
  logger.info(`Categoría eliminada: ID ${id}`);
};
