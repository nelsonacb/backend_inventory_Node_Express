import { Request, Response } from 'express';
import * as alertService from '../services/alertService';

export const getAll = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await alertService.getAllAlerts(page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  const count = await alertService.getUnreadCount();
  res.json({ unread_count: count });
};

export const markAsRead = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) throw new Error('ID inválido');
  await alertService.markAsRead(id);
  res.json({ message: 'Marcada como leída' });
};
