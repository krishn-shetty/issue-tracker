import * as repo from './repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { buildPagination, escapeRegex } from '../../utils/schemas.js';

export const list = async ({ search, page, limit }) => {
  const filter = {};
  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: rx }, { email: rx }];
  }
  const { items, total } = await repo.findPage(filter, { page, limit });
  return { items, pagination: buildPagination(page, limit, total) };
};

export const getById = async (id) => {
  const user = await repo.findById(id);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};
