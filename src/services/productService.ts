import { generateQRCode } from '../utils/qrcode';
import logger from '../utils/logger';
import { prisma } from '../../lib/prisma';

export const createProduct = async (
  data: any,
  imageFile?: Express.Multer.File,
) => {
  const { name, sku, barcode, categoryId, price, threshold, description } =
    data;
  const image = imageFile ? `/uploads/products/${imageFile.filename}` : null;
  const qrCode = await generateQRCode(sku);

  const product = await prisma.product.create({
    data: {
      name,
      sku,
      barcode,
      categoryId,
      price,
      threshold,
      description,
      image,
      qrCode,
    },
  });
  logger.info(`Producto creado: ${sku}`);
  return product;
};

export const getAllProducts = async (search?: string, categoryId?: number) => {
  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { barcode: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;
  const products = await prisma.product.findMany({
    where,
    include: { category: true, stocks: { include: { warehouse: true } } },
  });
  return products.map((p) => ({
    ...p,
    total_stock: p.stocks.reduce((sum, s) => sum + s.quantity, 0),
  }));
};

export const getProductById = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, stocks: { include: { warehouse: true } } },
  });
  if (!product) throw new Error('Producto no encontrado');
  const total_stock = product.stocks.reduce((sum, s) => sum + s.quantity, 0);
  return { ...product, total_stock };
};

export const updateProduct = async (
  id: number,
  data: any,
  imageFile?: Express.Multer.File,
) => {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new Error('Producto no encontrado');

  const updateData: any = { ...data };
  if (imageFile) updateData.image = `/uploads/products/${imageFile.filename}`;
  if (data.sku && data.sku !== existing.sku) {
    updateData.qrCode = await generateQRCode(data.sku);
  }
  const updated = await prisma.product.update({
    where: { id },
    data: updateData,
  });
  logger.info(`Producto actualizado: ID ${id}`);
  return updated;
};

export const deleteProduct = async (id: number) => {
  await prisma.product.delete({ where: { id } });
  logger.info(`Producto eliminado: ID ${id}`);
};

export const lookupByBarcode = async (barcode: string) => {
  const product = await prisma.product.findFirst({
    where: { OR: [{ barcode }, { sku: barcode }] },
    include: { category: true, stocks: { include: { warehouse: true } } },
  });
  if (!product) throw new Error('Producto no encontrado');
  const total_stock = product.stocks.reduce((sum, s) => sum + s.quantity, 0);
  return { ...product, total_stock };
};
