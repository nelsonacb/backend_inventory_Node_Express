import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import {
  createProductSchema,
  updateProductSchema,
} from '../validators/productValidator';
import * as productController from '../controllers/productController';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/products/' });

router.post(
  '/',
  authenticateToken,
  upload.single('image'),
  validate(createProductSchema),
  productController.createProduct,
);

router.get('/', authenticateToken, productController.getAllProducts);
router.get(
  '/lookup/by-barcode',
  authenticateToken,
  productController.lookupByBarcode,
);
router.get('/:id', authenticateToken, productController.getProductById);
router.put(
  '/:id',
  authenticateToken,
  upload.single('image'),
  validate(updateProductSchema),
  productController.updateProduct,
);
router.delete('/:id', authenticateToken, productController.deleteProduct);

export default router;
