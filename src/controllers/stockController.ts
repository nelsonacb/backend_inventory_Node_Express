import { Request, Response } from 'express';
import * as stockService from '../services/stockService';

export const getAll = async (req: Request, res: Response) => {
  try {
    const product = req.query.product ? Number(req.query.product) : undefined;
    const warehouse = req.query.warehouse
      ? Number(req.query.warehouse)
      : undefined;
    const page = parseInt(req.query.page as string) || undefined;
    const limit = parseInt(req.query.limit as string) || undefined;

    const result = await stockService.getAllStocks(
      product,
      warehouse,
      page,
      limit,
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener stocks' });
  }
};

export const createOrUpdate = async (req: Request, res: Response) => {
  const { productId, warehouseId, quantity } = req.body;
  const stock = await stockService.createOrUpdateStock(
    productId,
    warehouseId,
    quantity,
  );
  res.status(201).json(stock);
};

export const getById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) throw new Error('ID inválido');
  const stock = await stockService.getStockById(id);
  res.json(stock);
};

export const update = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) throw new Error('ID inválido');
  const { quantity } = req.body;
  const updated = await stockService.updateStock(id, quantity);
  res.json(updated);
};

export const deleteStock = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) throw new Error('ID inválido');
  await stockService.deleteStock(id);
  res.status(204).send();
};
