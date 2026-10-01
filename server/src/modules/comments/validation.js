import { z } from 'zod';
import { objectId, paginationShape } from '../../utils/schemas.js';

export const issueIdParam = z.object({ issueId: objectId });
export const commentBody = z.object({
  content: z.string().trim().min(1, 'Comment cannot be empty').max(2000, 'Comment is too long'),
});
export const listCommentsQuery = z.object(paginationShape({ defaultLimit: 50, maxLimit: 100 }));
