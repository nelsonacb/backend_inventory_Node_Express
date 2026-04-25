import { Request, Response } from 'express';
import * as alertService from '../services/alertService';

export const getAll = async (req: Request, res: Response) => {
  const alerts = await alertService.getAllAlerts();
  res.json(alerts);
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
