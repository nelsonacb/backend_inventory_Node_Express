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
  const movements = await movementService.getMovements();
  res.json(movements);
};
