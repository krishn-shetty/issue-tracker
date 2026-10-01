import { Issue } from './model.js';

const populate = [
  { path: 'createdBy', select: 'name email' },
  { path: 'assignedTo', select: 'name email' },
];

export const create = async (data) => {
  const doc = await Issue.create(data);
  return doc.populate(populate);
};

export const findById = (id) => Issue.findById(id).populate(populate);

export const exists = async (id) => Boolean(await Issue.exists({ _id: id }));

export const findPage = async (filter, { page, limit }) => {
  const [items, total] = await Promise.all([
    Issue.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(populate),
    Issue.countDocuments(filter),
  ]);
  return { items, total };
};

export const updateById = (id, changes) =>
  Issue.findByIdAndUpdate(id, { $set: changes }, { returnDocument: "after", runValidators: true }).populate(populate);

export const deleteById = (id) => Issue.findByIdAndDelete(id);
