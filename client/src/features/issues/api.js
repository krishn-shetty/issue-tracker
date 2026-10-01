import { api } from "../../lib/axios";

export async function getIssues(params) {
  const { data } = await api.get("/issues", { params });
  return { items: data.data, pagination: data.pagination };
}

export async function getIssue(id) {
  const { data } = await api.get(`/issues/${id}`);
  return data.data;
}

export async function createIssue(payload) {
  const { data } = await api.post("/issues", payload);
  return data.data;
}

export async function updateIssue({ id, changes }) {
  const { data } = await api.patch(`/issues/${id}`, changes);
  return data.data;
}

export async function deleteIssue(id) {
  await api.delete(`/issues/${id}`);
  return null;
}

export async function changeIssueStatus({ id, status }) {
  const { data } = await api.patch(`/issues/${id}/status`, { status });
  return data.data;
}

export async function changeIssueAssignee({ id, assignedTo }) {
  const { data } = await api.patch(`/issues/${id}/assignee`, { assignedTo });
  return data.data;
}