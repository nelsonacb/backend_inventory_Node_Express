import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { prisma } from '../../lib/prisma';

const router = Router();

router.get('/', authenticateToken, async (req, res) => {
  const movements = await prisma.stockMovement.findMany({
    include: {
      stock: { include: { product: true, warehouse: true } },
      user: true,
    },
    orderBy: { date: 'desc' },
  });
  res.json(movements);
});

router.post('/', authenticateToken, async (req, res) => {
  const { stockId, quantityChange, reason, notes } = req.body;
  const userId = (req as any).user.id;

  try {
    // Usar transacción para consistencia
    const result = await prisma.$transaction(async (tx) => {
      // 1. Crear movimiento
      const movement = await tx.stockMovement.create({
        data: {
          stockId,
          quantityChange,
          reason,
          notes,
          createdBy: userId,
        },
      });
      // 2. Actualizar stock
      const stock = await tx.stock.update({
        where: { id: stockId },
        data: { quantity: { increment: quantityChange } },
      });
      // 3. Si el stock es menor que el umbral, crear alerta
      const product = await tx.product.findUnique({
        where: { id: stock.productId },
        select: { threshold: true, name: true },
      });
      if (stock.quantity < product!.threshold) {
        await tx.alert.create({
          data: {
            productId: stock.productId,
            warehouseId: stock.warehouseId,
            message: `Stock bajo: ${product!.name} tiene ${stock.quantity} unidades (umbral ${product!.threshold})`,
          },
        });
      }
      return movement;
    });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Otras rutas (GET by id, PUT, DELETE) similares a las anteriores
export default router;
