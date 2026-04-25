import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { prisma } from '../../lib/prisma';

const router = Router();

// Listar stocks (con filtros opcionales por producto o almacén)
router.get('/', authenticateToken, async (req, res) => {
  const { product, warehouse } = req.query;
  let where: any = {};
  if (product) where.productId = parseInt(product as string, 10);
  if (warehouse) where.warehouseId = parseInt(warehouse as string, 10);
  const stocks = await prisma.stock.findMany({
    where,
    include: { product: true, warehouse: true },
  });
  res.json(stocks);
});

// Crear o actualizar stock (si ya existe, actualiza cantidad)
router.post('/', authenticateToken, async (req, res) => {
  const { productId, warehouseId, quantity } = req.body;
  try {
    const stock = await prisma.stock.upsert({
      where: { productId_warehouseId: { productId, warehouseId } },
      update: { quantity },
      create: { productId, warehouseId, quantity },
    });
    res.status(201).json(stock);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener stock por ID
router.get('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  const stock = await prisma.stock.findUnique({
    where: { id },
    include: { product: true, warehouse: true },
  });
  if (!stock) return res.status(404).json({ error: 'No encontrado' });
  res.json(stock);
});

// Actualizar stock (solo cantidad)
router.put('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  const { quantity } = req.body;
  try {
    const updated = await prisma.stock.update({
      where: { id },
      data: { quantity },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  await prisma.stock.delete({ where: { id } });
  res.status(204).send();
});

export default router;
