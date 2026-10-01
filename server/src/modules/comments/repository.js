import { Comment } from './model.js';

const populate = { path: 'author', select: 'name email' };

export const create = async (data) => {
  const doc = await Comment.create(data);
  return doc.populate(populate);
};

export const findById = (id) => Comment.findById(id).populate(populate);

export const findPageByIssue = async (issueId, { page, limit }) => {
  const [items, total] = await Promise.all([
    Comment.find({ issue: issueId })
      .sort({ createdAt: 1, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(populate),
    Comment.countDocuments({ issue: issueId }),
  ]);
  return { items, total };
};

export const updateContent = (id, content) =>
  Comment.findByIdAndUpdate(id, { $set: { content } }, { returnDocument: "after", runValidators: true }).populate(populate);

export const deleteById = (id) => Comment.findByIdAndDelete(id);
export const deleteByIssue = (issueId) => Comment.deleteMany({ issue: issueId });
