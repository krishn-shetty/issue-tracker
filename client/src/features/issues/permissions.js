// UI mirror of server rules — the API remains the real enforcer.
function isAdmin(user) {
  return user?.role === "ADMIN";
}

export function canManageIssue(issue, user) {
  if (!user || !issue) return false;
  return isAdmin(user) || issue.createdBy?.id === user.id;
}

export function canChangeIssueStatus(issue, user) {
  if (!user || !issue) return false;
  return canManageIssue(issue, user) || issue.assignedTo?.id === user.id;
}