import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export const getAll = async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
};

export const create = async (req: Request, res: Response) => {
  const { name, color } = req.body;
  const category = await prisma.category.create({
    data: { name, color: color || '#007bff' },
  });
  res.status(201).json(category);
};

export const getById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return res.status(404).json({ error: 'No encontrado' });
  res.json(category);
};

export const update = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  const { name, color } = req.body;
  const updated = await prisma.category.update({
    where: { id },
    data: { name, color },
  });
  res.json(updated);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  await prisma.category.delete({ where: { id } });
  res.status(204).send();
};
