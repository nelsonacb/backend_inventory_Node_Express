import { Request, Response } from 'express';
import * as movementService from '../services/movementService';

export const createMovement = async (req: Request, res: Response) => {
  const { stockId, quantityChange, reason, notes } = req.body;
  const userId = req.user!.id;
  const movement = await movementService.createMovement(
    stockId,
    quantityChange,
    reason,
    notes,
    userId,
  );
  res.status(201).json(movement);
};

export const getMovements = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || undefined;
    const limit = parseInt(req.query.limit as string) || undefined;
    const result = await movementService.getMovements(page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener movimientos' });
  }
};
