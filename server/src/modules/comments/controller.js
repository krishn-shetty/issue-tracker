import * as service from './service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';

export const list = asyncHandler(async (req, res) => {
  const { items, pagination } = await service.listByIssue(req.params.issueId, req.query);
  sendSuccess(res, items, 200, { pagination });
});

export const create = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.create(req.user, req.params.issueId, req.body.content), 201);
});

export const update = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.update(req.user, req.params.id, req.body.content));
});

export const remove = asyncHandler(async (req, res) => {
  await service.remove(req.user, req.params.id);
  sendSuccess(res, null);
});
