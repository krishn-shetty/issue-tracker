import { api } from "../../lib/axios";

export async function registerUser(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data.data;
}

export async function loginUser(credentials) {
  const { data } = await api.post("/auth/login", credentials);
  return data.data;
}

export async function logoutUser() {
  await api.post("/auth/logout");
  return null;
}

export async function getCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data.data;
}