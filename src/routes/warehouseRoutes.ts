import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { prisma } from '../../lib/prisma';

const router = Router();

// Listar almacenes
router.get('/', authenticateToken, async (req, res) => {
  const warehouses = await prisma.warehouse.findMany();
  res.json(warehouses);
});

// Crear almacén
router.post('/', authenticateToken, async (req, res) => {
  const { name, location } = req.body;
  try {
    const warehouse = await prisma.warehouse.create({
      data: { name, location },
    });
    res.status(201).json(warehouse);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener un almacén
router.get('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  const warehouse = await prisma.warehouse.findUnique({ where: { id } });
  if (!warehouse) return res.status(404).json({ error: 'No encontrado' });
  res.json(warehouse);
});

// Actualizar almacén
router.put('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  const { name, location } = req.body;
  try {
    const updated = await prisma.warehouse.update({
      where: { id },
      data: { name, location },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar almacén
router.delete('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string as string, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  await prisma.warehouse.delete({ where: { id } });
  res.status(204).send();
});

export default router;
