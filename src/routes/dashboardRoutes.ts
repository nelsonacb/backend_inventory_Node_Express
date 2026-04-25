import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { prisma } from '../../lib/prisma';

const router = Router();

router.get('/stats', authenticateToken, async (req, res) => {
  const totalProducts = await prisma.product.count();
  const stocks = await prisma.stock.findMany({ include: { product: true } });
  let totalStockValue = 0;
  for (const s of stocks) {
    totalStockValue += s.quantity * s.product.price;
  }
  totalStockValue = parseFloat(totalStockValue.toFixed(2));

  const lowStockProducts = [];
  for (const s of stocks) {
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

  const recentMovements = await prisma.stockMovement.findMany({
    take: 5,
    orderBy: { date: 'desc' },
    include: { stock: { include: { product: true, warehouse: true } } },
  });

  res.json({
    total_products: totalProducts,
    total_stock_value: totalStockValue,
    low_stock_count: lowStockProducts.length,
    low_stock_products: lowStockProducts,
    recent_activity: recentMovements,
  });
});

router.get('/sales', authenticateToken, async (req, res) => {
  const { from, to } = req.query;
  let where: any = { reason: 'sale' };
  if (from) where.date = { gte: new Date(from as string) };
  if (to) where.date = { ...where.date, lte: new Date(to as string) };

  const movements = await prisma.stockMovement.findMany({
    where,
    include: { stock: { include: { product: true } } },
  });

  // Agrupar por día
  const salesByDay: Record<string, number> = {};
  for (const m of movements) {
    const day = m.date.toISOString().split('T')[0];
    salesByDay[day] = (salesByDay[day] || 0) + Math.abs(m.quantityChange);
  }
  const chartData = {
    labels: Object.keys(salesByDay).sort(),
    values: Object.values(salesByDay),
  };
  res.json({
    total_sales_units: Object.values(salesByDay).reduce((a, b) => a + b, 0),
    chart_data: chartData,
    movements,
  });
});

// Exportar CSV (requiere 'json2csv' o similar, opcional)
router.get('/export-csv', authenticateToken, async (req, res) => {
  const movements = await prisma.stockMovement.findMany({
    include: {
      stock: { include: { product: true, warehouse: true } },
      user: true,
    },
    orderBy: { date: 'desc' },
  });
  // Aquí conviertes a CSV (puedes usar 'papaparse' o 'json2csv')
  const csvRows = [
    [
      'Fecha',
      'Producto',
      'Almacén',
      'Cantidad',
      'Motivo',
      'Notas',
      'Creado por',
    ],
  ];
  for (const m of movements) {
    csvRows.push([
      m.date.toISOString(),
      m.stock.product.name,
      m.stock.warehouse.name,
      m.quantityChange.toString(),
      m.reason,
      m.notes || '',
      m.user?.email || '',
    ]);
  }
  const csvContent = csvRows.map((row) => row.join(',')).join('\n');
  res.header('Content-Type', 'text/csv');
  res.attachment('movimientos_stock.csv');
  res.send(csvContent);
});

export default router;
