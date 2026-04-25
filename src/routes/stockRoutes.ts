import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import * as stockController from '../controllers/stockController';

const router = Router();
router.get('/', authenticateToken, stockController.getAll);
router.post('/', authenticateToken, stockController.createOrUpdate);
router.get('/:id', authenticateToken, stockController.getById);
router.put('/:id', authenticateToken, stockController.update);
router.delete('/:id', authenticateToken, stockController.deleteStock);
export default router;
