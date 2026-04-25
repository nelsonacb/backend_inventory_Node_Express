import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { createMovementSchema } from '../validators/movementValidator';
import * as movementController from '../controllers/movementController';

const router = Router();

router.post(
  '/',
  authenticateToken,
  validate(createMovementSchema),
  movementController.createMovement,
);
router.get('/', authenticateToken, movementController.getMovements);

export default router;
