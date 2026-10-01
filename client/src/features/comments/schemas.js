import { z } from "zod";

export const COMMENT_MAX_LENGTH = 2000;

export const commentSchema = z.object({
  content: z.
  string().
  trim().
  min(1, "Comment cannot be empty.").
  max(COMMENT_MAX_LENGTH, `Comment must be at most ${COMMENT_MAX_LENGTH} characters.`)
});