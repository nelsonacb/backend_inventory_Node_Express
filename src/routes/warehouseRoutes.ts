import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import * as warehouseController from '../controllers/warehouseController';

const router = Router();

router.get('/', authenticateToken, warehouseController.getAll);
router.post('/', authenticateToken, warehouseController.create);
router.get('/:id', authenticateToken, warehouseController.getById);
router.put('/:id', authenticateToken, warehouseController.update);
router.delete('/:id', authenticateToken, warehouseController.deleteWarehouse);

export default router;
