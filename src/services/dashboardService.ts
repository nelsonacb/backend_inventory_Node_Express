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
