import mongoose from 'mongoose';
import { toJSONOptions } from '../../utils/toJSON.js';

export const ISSUE_STATUSES = ['OPEN', 'IN_PROGRESS', 'CLOSED'];
export const ISSUE_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    status: { type: String, enum: ISSUE_STATUSES, default: 'OPEN', index: true },
    priority: { type: String, enum: ISSUE_PRIORITIES, default: 'MEDIUM', index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  },
  { timestamps: true, toJSON: toJSONOptions }
);

issueSchema.index({ createdAt: -1 });

export const Issue = mongoose.model('Issue', issueSchema);
