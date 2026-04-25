import { Request, Response } from 'express';
import * as stockService from '../services/stockService';

export const getAll = async (req: Request, res: Response) => {
  const { product, warehouse } = req.query;
  const stocks = await stockService.getAllStocks(
    product ? Number(product) : undefined,
    warehouse ? Number(warehouse) : undefined,
  );
  res.json(stocks);
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
