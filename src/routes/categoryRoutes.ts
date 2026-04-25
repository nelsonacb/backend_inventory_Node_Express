import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import * as categoryController from '../controllers/categoryController';

const router = Router();
router.get('/', authenticateToken, categoryController.getAll);
router.post('/', authenticateToken, categoryController.create);
router.get('/:id', authenticateToken, categoryController.getById);
router.put('/:id', authenticateToken, categoryController.update);
router.delete('/:id', authenticateToken, categoryController.deleteCategory);
export default router;
