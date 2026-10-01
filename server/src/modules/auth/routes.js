import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as c from './controller.js';
import { protect } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { loginBody, registerBody } from './validation.js';
import { isProd } from '../../config/env.js';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isProd ? 20 : 500,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
});

const router = Router();
router.post('/register', authLimiter, validate({ body: registerBody }), c.register);
router.post('/login', authLimiter, validate({ body: loginBody }), c.login);
router.post('/logout', c.logout);
router.get('/me', protect, c.me);

export default router;
