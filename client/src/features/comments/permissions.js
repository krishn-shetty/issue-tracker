// UI mirror of server rules — the API remains the real enforcer.
export function canEditComment(comment, user) {
  return Boolean(user && comment?.author?.id === user.id);
}

export function canDeleteComment(comment, user) {
  return Boolean(user && (user.role === "ADMIN" || comment?.author?.id === user.id));
}