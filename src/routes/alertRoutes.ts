import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { prisma } from '../../lib/prisma';

const router = Router();

router.get('/', authenticateToken, async (req, res) => {
  const alerts = await prisma.alert.findMany({
    include: { product: true, warehouse: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(alerts);
});

router.get('/unread-count', authenticateToken, async (req, res) => {
  const count = await prisma.alert.count({ where: { isRead: false } });
  res.json({ unread_count: count });
});

router.patch('/:id/mark-as-read', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  await prisma.alert.update({
    where: { id },
    data: { isRead: true },
  });
  res.json({ message: 'Marcada como leída' });
});

export default router;
