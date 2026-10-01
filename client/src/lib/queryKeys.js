export const queryKeys = {
  auth: {
    me: ["auth", "me"]
  },
  issues: {
    all: ["issues"],
    list: (params) => ["issues", "list", params],
    detail: (id) => ["issues", "detail", id]
  },
  comments: {
    list: (issueId) => ["comments", issueId]
  },
  users: {
    list: (params) => ["users", "list", params]
  },
  dashboard: {
    summary: ["dashboard", "summary"]
  }
};