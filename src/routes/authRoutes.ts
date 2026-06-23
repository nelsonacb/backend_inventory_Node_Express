import { Router } from 'express';
import { validate } from '../middlewares/validation';
import { registerSchema, loginSchema } from '../validators/authValidator';
import * as authController from '../controllers/authController';
import { limiter } from '../middlewares/rateLimiter';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/token', limiter, validate(loginSchema), authController.login);
router.get('/me', authenticateToken, authController.getMe);
router.post('/refresh', authController.refresh);

export default router;
