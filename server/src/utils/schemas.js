import { z } from 'zod';

export const emptyToUndefined = (v) => (v === '' ? undefined : v);

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID');
export const idParam = z.object({ id: objectId });

// '' -> null so the frontend can send an empty "unassigned" select value
export const nullableId = z.preprocess((v) => (v === '' ? null : v), objectId.nullable());

export const optionalParam = (schema) => z.preprocess(emptyToUndefined, schema.optional());

export const paginationShape = ({ defaultLimit = 10, maxLimit = 50 } = {}) => ({
  page: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).default(1)),
  limit: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(1).max(maxLimit).default(defaultLimit)
  ),
});

export const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  pages: Math.ceil(total / limit),
});

export const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
