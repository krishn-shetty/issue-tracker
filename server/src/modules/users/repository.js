import { User } from './model.js';

export const findById = (id) => User.findById(id);
export const findByEmail = (email) => User.findOne({ email });
export const findByEmailWithPassword = (email) => User.findOne({ email }).select('+password');
export const create = (data) => User.create(data);
export const exists = async (id) => Boolean(await User.exists({ _id: id }));

export const findPage = async (filter, { page, limit }) => {
  const [items, total] = await Promise.all([
    User.find(filter).sort({ name: 1 }).skip((page - 1) * limit).limit(limit),
    User.countDocuments(filter),
  ]);
  return { items, total };
};
