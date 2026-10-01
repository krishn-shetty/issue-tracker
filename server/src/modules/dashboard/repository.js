import { Issue } from '../issues/model.js';

export const countByStatus = () =>
  Issue.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

export const countMine = (userId) =>
  Issue.countDocuments({ $or: [{ assignedTo: userId }, { createdBy: userId }] });
