import { generateQRCode } from '../utils/qrcode';
import logger from '../utils/logger';
import { prisma } from '../../lib/prisma';

export const createProduct = async (
  data: any,
  imageFile?: Express.Multer.File,
) => {
  const {
    name,
    sku,
    barcode,
    categoryId,
    price,
    threshold,
    description,
    initialStock,
    warehouseId,
  } = data;

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    throw new Error(`La categoría con ID ${categoryId} no existe`);
  }

  if (warehouseId) {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });
    if (!warehouse) {
      throw new Error(`El almacén con ID ${warehouseId} no existe`);
    }
  }

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

  if (initialStock && warehouseId) {
    await prisma.stock.create({
      data: {
        productId: product.id,
        warehouseId,
        quantity: initialStock,
      },
    });
  }

  logger.info(`Producto creado: ${sku}`);
  return product;
};

export const getAllProducts = async (
  search?: string,
  categoryId?: number,
  page?: number,
  limit?: number,
) => {
  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { barcode: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;

  const include = {
    category: true,
    stocks: { include: { warehouse: true } },
  };

  if (page && limit) {
    const skip = (page - 1) * limit;
    const [data, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      prisma.product.count({ where }),
    ]);
    const productsWithStock = data.map((p) => ({
      ...p,
      total_stock: p.stocks.reduce((sum, s) => sum + s.quantity, 0),
    }));
    return {
      data: productsWithStock,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  const products = await prisma.product.findMany({ where, include });
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
  const total_stock = product.stocks.reduce(
    (sum: any, s: { quantity: any }) => sum + s.quantity,
    0,
  );
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
  const total_stock = product.stocks.reduce(
    (sum: any, s: { quantity: any }) => sum + s.quantity,
    0,
  );
  return { ...product, total_stock };
};
