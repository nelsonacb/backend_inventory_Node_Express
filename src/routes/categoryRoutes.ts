import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { prisma } from '../../lib/prisma';

const router = Router();

router.get('/', authenticateToken, async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

router.post('/', authenticateToken, async (req, res) => {
  const { name, color } = req.body;
  try {
    const category = await prisma.category.create({
      data: { name, color: color || '#007bff' },
    });
    res.status(201).json(category);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return res.status(404).json({ error: 'No encontrado' });
  res.json(category);
});

router.put('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  const { name, color } = req.body;
  try {
    const updated = await prisma.category.update({
      where: { id },
      data: { name, color },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  await prisma.category.delete({ where: { id } });
  res.status(204).send();
});

export default router;
