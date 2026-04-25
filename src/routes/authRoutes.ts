import { Router } from 'express';
import { validate } from '../middlewares/validation';
import { registerSchema, loginSchema } from '../validators/authValidator';
import * as authController from '../controllers/authController';
import { limiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/token', limiter, validate(loginSchema), authController.login);

export default router;
