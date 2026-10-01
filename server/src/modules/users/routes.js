import { Router } from 'express';
import * as c from './controller.js';
import { protect } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { idParam } from '../../utils/schemas.js';
import { listUsersQuery } from './validation.js';

const router = Router();
router.use(protect);
router.get('/', validate({ query: listUsersQuery }), c.list);
router.get('/:id', validate({ params: idParam }), c.getById);

export default router;
