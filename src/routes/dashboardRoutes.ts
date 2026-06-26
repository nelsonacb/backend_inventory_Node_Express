import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import * as dashboardController from '../controllers/dashboardController';

const router = Router();
router.get('/stats', authenticateToken, dashboardController.getStats);
router.get('/sales', authenticateToken, dashboardController.getSalesReport);
router.get('/export-csv', authenticateToken, dashboardController.exportCSV);
router.get(
  '/stock-by-category',
  authenticateToken,
  dashboardController.getStockByCategory,
);
router.get('/low-stock', authenticateToken, dashboardController.getLowStock);
export default router;
