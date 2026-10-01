import { z } from 'zod';
import { ISSUE_PRIORITIES, ISSUE_STATUSES } from './model.js';
import { nullableId, objectId, optionalParam, paginationShape } from '../../utils/schemas.js';

const title = z.string().trim().min(3, 'Title must be at least 3 characters').max(120, 'Title must be at most 120 characters');
const description = z.string().trim().min(1, 'Description is required').max(5000);
const status = z.enum(ISSUE_STATUSES);
const priority = z.enum(ISSUE_PRIORITIES);

export const listIssuesQuery = z.object({
  search: optionalParam(z.string().trim().max(100)),
  status: optionalParam(status),
  priority: optionalParam(priority),
  // 'me' | 'unassigned' | user id
  assignee: optionalParam(z.union([z.literal('me'), z.literal('unassigned'), objectId])),
  ...paginationShape({ defaultLimit: 10, maxLimit: 50 }),
});

export const createIssueBody = z.object({
  title,
  description,
  status: status.default('OPEN'),
  priority: priority.default('MEDIUM'),
  assignedTo: nullableId.optional(),
});

export const updateIssueBody = z
  .object({ title, description, status, priority, assignedTo: nullableId })
  .partial()
  .refine((o) => Object.keys(o).length > 0, { message: 'At least one field is required' });

export const statusBody = z.object({ status });
export const assigneeBody = z.object({ assignedTo: nullableId });
