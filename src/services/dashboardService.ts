import { prisma } from '../../lib/prisma';
import { Prisma } from '../../generated/prisma/client';

export const getStats = async () => {
  const totalProducts = await prisma.product.count();
  const stocks = await prisma.stock.findMany({ include: { product: true } });
  let totalStockValue = 0;
  const lowStockProducts: any[] = [];
  for (const s of stocks) {
    totalStockValue += s.quantity * s.product.price;
    if (s.quantity < s.product.threshold) {
      lowStockProducts.push({
        product_id: s.product.id,
        product_name: s.product.name,
        stock: s.quantity,
        threshold: s.product.threshold,
        warehouse: s.warehouseId,
      });
    }
  }
  totalStockValue = parseFloat(totalStockValue.toFixed(2));
  const recentMovements = await prisma.stockMovement.findMany({
    take: 5,
    orderBy: { date: 'desc' },
    include: { stock: { include: { product: true, warehouse: true } } },
  });
  return {
    total_products: totalProducts,
    total_stock_value: totalStockValue,
    low_stock_count: lowStockProducts.length,
    low_stock_products: lowStockProducts,
    recent_activity: recentMovements,
  };
};

export const getSalesReport = async (from?: string, to?: string) => {
  const where: Prisma.StockMovementWhereInput = { reason: 'sale' };
  if (from) where.date = { gte: new Date(from) };
  if (to) where.date = { ...(where.date as any), lte: new Date(to) };
  const movements = await prisma.stockMovement.findMany({
    where,
    include: { stock: { include: { product: true } } },
  });
  const salesByDay: Record<string, number> = {};
  for (const m of movements) {
    const day = m.date.toISOString().split('T')[0];
    salesByDay[day] = (salesByDay[day] || 0) + Math.abs(m.quantityChange);
  }
  const chartData = {
    labels: Object.keys(salesByDay).sort(),
    values: Object.values(salesByDay),
  };
  return {
    total_sales_units: Object.values(salesByDay).reduce((a, b) => a + b, 0),
    chart_data: chartData,
    movements,
  };
};

export const exportCSV = async () => {
  const movements = await prisma.stockMovement.findMany({
    include: {
      stock: { include: { product: true, warehouse: true } },
      user: true,
    },
    orderBy: { date: 'desc' },
  });
  const rows = movements.map((m) => ({
    Fecha: m.date.toISOString(),
    Producto: m.stock.product.name,
    Almacén: m.stock.warehouse.name,
    Cantidad: m.quantityChange,
    Motivo: m.reason,
    Notas: m.notes || '',
    Creado_por: m.user?.email || '',
  }));
  return rows;
};

export const getStockByCategory = async () => {
  const stocks = await prisma.stock.findMany({
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });

  const categoryMap = new Map<string, number>();
  for (const s of stocks) {
    const catName = s.product.category?.name || 'Sin categoría';
    const value = s.quantity * s.product.price;
    categoryMap.set(catName, (categoryMap.get(catName) || 0) + value);
  }

  const result = Array.from(categoryMap.entries()).map(([category, value]) => ({
    category,
    value: parseFloat(value.toFixed(2)),
  }));

  return result;
};

export const getLowStock = async (limit = 5) => {
  const stocks = await prisma.stock.findMany({
    include: {
      product: true,
    },
  });

  const productStockMap = new Map<
    number,
    { totalStock: number; threshold: number; name: string }
  >();
  for (const s of stocks) {
    const existing = productStockMap.get(s.productId);
    if (existing) {
      existing.totalStock += s.quantity;
    } else {
      productStockMap.set(s.productId, {
        totalStock: s.quantity,
        threshold: s.product.threshold,
        name: s.product.name,
      });
    }
  }

  const lowStockItems = Array.from(productStockMap.entries())
    .filter(([_, data]) => data.totalStock < data.threshold)
    .map(([productId, data]) => ({
      productId,
      name: data.name,
      stock: data.totalStock,
      threshold: data.threshold,
    }))
    .sort((a, b) => a.stock - b.stock)
    .slice(0, limit);

  return lowStockItems;
};
