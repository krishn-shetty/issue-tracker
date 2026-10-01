import { api } from "../../lib/axios";

export async function getComments(issueId, params) {
  const { data } = await api.get(`/issues/${issueId}/comments`, { params });
  return { items: data.data, pagination: data.pagination };
}

export async function createComment({ issueId, content }) {
  const { data } = await api.post(`/issues/${issueId}/comments`, { content });
  return data.data;
}

export async function updateComment({ id, content }) {
  const { data } = await api.patch(`/comments/${id}`, { content });
  return data.data;
}

export async function deleteComment(id) {
  await api.delete(`/comments/${id}`);
  return null;
}