import * as repo from './repository.js';
import * as userRepo from '../users/repository.js';
import * as commentRepo from '../comments/repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { buildPagination, escapeRegex } from '../../utils/schemas.js';

const idOf = (v) => (v ? String(v._id ?? v) : null);
const isAdmin = (user) => user.role === 'ADMIN';
const isCreator = (issue, user) => idOf(issue.createdBy) === String(user._id);
const isAssignee = (issue, user) => idOf(issue.assignedTo) === String(user._id);

const getOrThrow = async (id) => {
  const issue = await repo.findById(id);
  if (!issue) throw new ApiError(404, 'Issue not found');
  return issue;
};

const assertCanManage = (issue, user) => {
  if (!isAdmin(user) && !isCreator(issue, user)) {
    throw new ApiError(403, 'You do not have permission to modify this issue');
  }
};

const assertAssigneeExists = async (assignedTo) => {
  if (assignedTo && !(await userRepo.exists(assignedTo))) {
    throw new ApiError(422, 'Assignee user not found');
  }
};

export const list = async (user, query) => {
  const { search, status, priority, assignee, page, limit } = query;
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignee === 'me') filter.assignedTo = user._id;
  else if (assignee === 'unassigned') filter.assignedTo = null;
  else if (assignee) filter.assignedTo = assignee;
  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ title: rx }, { description: rx }];
  }
  const { items, total } = await repo.findPage(filter, { page, limit });
  return { items, pagination: buildPagination(page, limit, total) };
};

export const getById = (id) => getOrThrow(id);

export const create = async (user, data) => {
  await assertAssigneeExists(data.assignedTo);
  return repo.create({ ...data, assignedTo: data.assignedTo ?? null, createdBy: user._id });
};

export const update = async (user, id, changes) => {
  const issue = await getOrThrow(id);
  assertCanManage(issue, user);
  await assertAssigneeExists(changes.assignedTo);
  return repo.updateById(id, changes);
};

// Creator, current assignee or admin can change status
export const changeStatus = async (user, id, status) => {
  const issue = await getOrThrow(id);
  if (!isAdmin(user) && !isCreator(issue, user) && !isAssignee(issue, user)) {
    throw new ApiError(403, 'You do not have permission to change this issue status');
  }
  return repo.updateById(id, { status });
};

export const changeAssignee = async (user, id, assignedTo) => {
  const issue = await getOrThrow(id);
  assertCanManage(issue, user);
  await assertAssigneeExists(assignedTo);
  return repo.updateById(id, { assignedTo });
};

export const remove = async (user, id) => {
  const issue = await getOrThrow(id);
  assertCanManage(issue, user);
  await repo.deleteById(id);
  await commentRepo.deleteByIssue(id);
};
