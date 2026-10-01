import { Router } from 'express';
import * as c from './controller.js';
import { protect } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { idParam } from '../../utils/schemas.js';
import {
  assigneeBody,
  createIssueBody,
  listIssuesQuery,
  statusBody,
  updateIssueBody,
} from './validation.js';

const router = Router();
router.use(protect);

router.get('/', validate({ query: listIssuesQuery }), c.list);
router.post('/', validate({ body: createIssueBody }), c.create);
router.get('/:id', validate({ params: idParam }), c.getById);
router.patch('/:id', validate({ params: idParam, body: updateIssueBody }), c.update);
router.delete('/:id', validate({ params: idParam }), c.remove);
router.patch('/:id/status', validate({ params: idParam, body: statusBody }), c.changeStatus);
router.patch('/:id/assignee', validate({ params: idParam, body: assigneeBody }), c.changeAssignee);

export default router;
