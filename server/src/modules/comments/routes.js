import { Router } from 'express';
import * as c from './controller.js';
import { protect } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { idParam } from '../../utils/schemas.js';
import { commentBody, issueIdParam, listCommentsQuery } from './validation.js';

// Mounted at /api/v1 (before the issues router) because it serves both
// /issues/:issueId/comments and /comments/:id
const router = Router();

router.get('/issues/:issueId/comments', protect, validate({ params: issueIdParam, query: listCommentsQuery }), c.list);
router.post('/issues/:issueId/comments', protect, validate({ params: issueIdParam, body: commentBody }), c.create);
router.patch('/comments/:id', protect, validate({ params: idParam, body: commentBody }), c.update);
router.delete('/comments/:id', protect, validate({ params: idParam }), c.remove);

export default router;
