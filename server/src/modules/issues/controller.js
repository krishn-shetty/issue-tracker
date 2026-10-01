import * as service from './service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';

export const list = asyncHandler(async (req, res) => {
  const { items, pagination } = await service.list(req.user, req.query);
  sendSuccess(res, items, 200, { pagination });
});

export const getById = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.getById(req.params.id));
});

export const create = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.create(req.user, req.body), 201);
});

export const update = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.update(req.user, req.params.id, req.body));
});

export const changeStatus = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.changeStatus(req.user, req.params.id, req.body.status));
});

export const changeAssignee = asyncHandler(async (req, res) => {
  sendSuccess(res, await service.changeAssignee(req.user, req.params.id, req.body.assignedTo));
});

export const remove = asyncHandler(async (req, res) => {
  await service.remove(req.user, req.params.id);
  sendSuccess(res, null);
});
