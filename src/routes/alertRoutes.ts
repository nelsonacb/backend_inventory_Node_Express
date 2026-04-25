import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import * as alertController from '../controllers/alertController';

const router = Router();
router.get('/', authenticateToken, alertController.getAll);
router.get('/unread-count', authenticateToken, alertController.getUnreadCount);
router.patch(
  '/:id/mark-as-read',
  authenticateToken,
  alertController.markAsRead,
);
export default router;
