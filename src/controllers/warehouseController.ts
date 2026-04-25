import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export const getAll = async (req: Request, res: Response) => {
  const warehouses = await prisma.warehouse.findMany();
  res.json(warehouses);
};

export const create = async (req: Request, res: Response) => {
  const { name, location } = req.body;
  const warehouse = await prisma.warehouse.create({ data: { name, location } });
  res.status(201).json(warehouse);
};

export const getById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  const warehouse = await prisma.warehouse.findUnique({ where: { id } });
  if (!warehouse) return res.status(404).json({ error: 'No encontrado' });
  res.json(warehouse);
};

export const update = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  const { name, location } = req.body;
  const updated = await prisma.warehouse.update({
    where: { id },
    data: { name, location },
  });
  res.json(updated);
};

export const deleteWarehouse = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  await prisma.warehouse.delete({ where: { id } });
  res.status(204).send();
};
