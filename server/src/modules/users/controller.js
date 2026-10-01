import * as service from './service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';

export const list = asyncHandler(async (req, res) => {
  const { items, pagination } = await service.list(req.query);
  sendSuccess(res, items, 200, { pagination });
});

export const getById = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getById(req.params.id));
});
