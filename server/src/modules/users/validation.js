import { z } from 'zod';
import { optionalParam, paginationShape } from '../../utils/schemas.js';

export const listUsersQuery = z.object({
  search: optionalParam(z.string().trim().max(50)),
  ...paginationShape({ defaultLimit: 50, maxLimit: 100 }),
});
