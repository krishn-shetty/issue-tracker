import { z } from "zod";
import {
  ISSUE_DESCRIPTION_MAX,
  ISSUE_PRIORITIES,
  ISSUE_STATUSES,
  ISSUE_TITLE_MAX,
  ISSUE_TITLE_MIN,
  OBJECT_ID_PATTERN } from
"./constants";

export const issueFormSchema = z.object({
  title: z.
  string().
  trim().
  min(ISSUE_TITLE_MIN, `Title must be at least ${ISSUE_TITLE_MIN} characters.`).
  max(ISSUE_TITLE_MAX, `Title must be at most ${ISSUE_TITLE_MAX} characters.`),
  description: z.
  string().
  trim().
  min(1, "Description is required.").
  max(ISSUE_DESCRIPTION_MAX, `Description must be at most ${ISSUE_DESCRIPTION_MAX} characters.`),
  status: z.enum(ISSUE_STATUSES, { message: "Select a valid status." }),
  priority: z.enum(ISSUE_PRIORITIES, { message: "Select a valid priority." }),
  assignedTo: z.union([z.literal(""), z.string().regex(OBJECT_ID_PATTERN, "Select a valid assignee.")])
});

export function toIssueFormValues(issue) {
  return {
    title: issue.title,
    description: issue.description,
    status: issue.status,
    priority: issue.priority,
    assignedTo: issue.assignedTo?.id ?? ""
  };
}

// The API expects null (not "") for "unassigned".
export function toIssuePayload(values) {
  return { ...values, assignedTo: values.assignedTo || null };
}

export function getChangedIssueFields(values, issue) {
  const original = toIssueFormValues(issue);
  const changedKeys = Object.keys(values).filter((key) => values[key] !== original[key]);
  const changes = Object.fromEntries(changedKeys.map((key) => [key, values[key]]));
  return "assignedTo" in changes ? { ...changes, assignedTo: changes.assignedTo || null } : changes;
}