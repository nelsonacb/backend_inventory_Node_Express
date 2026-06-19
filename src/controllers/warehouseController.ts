import { Request, Response } from 'express';
import * as warehouseService from '../services/warehouseService';

export const getAll = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || undefined;
    const limit = parseInt(req.query.limit as string) || undefined;
    const result = await warehouseService.getAllWarehouses(page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener almacenes' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { name, location } = req.body;
    const warehouse = await warehouseService.createWarehouse(name, location);
    res.status(201).json(warehouse);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear almacén' });
  }
};

export const getById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const warehouse = await warehouseService.getWarehouseById(id);
    res.json(warehouse);
  } catch (error) {
    if (error instanceof Error && error.message === 'Almacén no encontrado') {
      return res.status(404).json({ error: 'No encontrado' });
    }
    res.status(500).json({ error: 'Error al obtener almacén' });
  }
};

export const update = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const { name, location } = req.body;
    const updated = await warehouseService.updateWarehouse(id, name, location);
    res.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === 'Almacén no encontrado') {
      return res.status(404).json({ error: 'No encontrado' });
    }
    res.status(500).json({ error: 'Error al actualizar almacén' });
  }
};

export const deleteWarehouse = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    await warehouseService.deleteWarehouse(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === 'Almacén no encontrado') {
      return res.status(404).json({ error: 'No encontrado' });
    }
    res.status(500).json({ error: 'Error al eliminar almacén' });
  }
};
