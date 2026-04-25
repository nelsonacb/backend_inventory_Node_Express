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
    ...rows.map((r) => Object.values(r)),
  ];
  const csvContent = csvRows.map((row) => row.join(',')).join('\n');
  res.header('Content-Type', 'text/csv');
  res.attachment('movimientos_stock.csv');
  res.send(csvContent);
};
