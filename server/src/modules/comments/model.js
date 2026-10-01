import mongoose from 'mongoose';
import { toJSONOptions } from '../../utils/toJSON.js';

const commentSchema = new mongoose.Schema(
  {
    issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true, minlength: 1, maxlength: 2000 },
  },
  { timestamps: true, toJSON: toJSONOptions }
);

commentSchema.index({ issue: 1, createdAt: 1 });

export const Comment = mongoose.model('Comment', commentSchema);
