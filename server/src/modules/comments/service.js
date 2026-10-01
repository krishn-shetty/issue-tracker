import * as repo from './repository.js';
import * as issueRepo from '../issues/repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { buildPagination } from '../../utils/schemas.js';

const idOf = (v) => (v ? String(v._id ?? v) : null);
const isAuthor = (comment, user) => idOf(comment.author) === String(user._id);

const getOrThrow = async (id) => {
  const comment = await repo.findById(id);
  if (!comment) throw new ApiError(404, 'Comment not found');
  return comment;
};

const assertIssueExists = async (issueId) => {
  if (!(await issueRepo.exists(issueId))) throw new ApiError(404, 'Issue not found');
};

export const listByIssue = async (issueId, { page, limit }) => {
  await assertIssueExists(issueId);
  const { items, total } = await repo.findPageByIssue(issueId, { page, limit });
  return { items, pagination: buildPagination(page, limit, total) };
};

export const create = async (user, issueId, content) => {
  await assertIssueExists(issueId);
  return repo.create({ issue: issueId, author: user._id, content });
};

// Only the author can edit
export const update = async (user, id, content) => {
  const comment = await getOrThrow(id);
  if (!isAuthor(comment, user)) throw new ApiError(403, 'You can only edit your own comments');
  return repo.updateContent(id, content);
};

// Author or admin can delete
export const remove = async (user, id) => {
  const comment = await getOrThrow(id);
  if (!isAuthor(comment, user) && user.role !== 'ADMIN') {
    throw new ApiError(403, 'You can only delete your own comments');
  }
  await repo.deleteById(id);
};
