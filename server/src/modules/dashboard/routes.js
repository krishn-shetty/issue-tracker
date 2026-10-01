import { Router } from 'express';
import * as c from './controller.js';
import { protect } from '../../middlewares/auth.js';

const router = Router();
router.get('/summary', protect, c.summary);

export default router;
