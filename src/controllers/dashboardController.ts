import { Request, Response } from 'express';
import * as dashboardService from '../services/dashboardService';

export const getStats = async (req: Request, res: Response) => {
  const stats = await dashboardService.getStats();
  res.json(stats);
};

export const getSalesReport = async (req: Request, res: Response) => {
  const { from, to } = req.query;
  const report = await dashboardService.getSalesReport(
    from as string | undefined,
    to as string | undefined,
  );
  res.json(report);
};

export const exportCSV = async (req: Request, res: Response) => {
  const rows = await dashboardService.exportCSV();
  // Convertir a CSV
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
    ...rows.map((r: { [s: string]: unknown } | ArrayLike<unknown>) =>
      Object.values(r),
    ),
  ];
  const csvContent = csvRows.map((row) => row.join(',')).join('\n');
  res.header('Content-Type', 'text/csv');
  res.attachment('movimientos_stock.csv');
  res.send(csvContent);
};

export const getStockByCategory = async (req: Request, res: Response) => {
  try {
    const data = await dashboardService.getStockByCategory();
    res.json(data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Error al obtener distribución por categoría' });
  }
};

export const getLowStock = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const data = await dashboardService.getLowStock(limit);
    res.json(data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'Error al obtener productos con bajo stock' });
  }
};
