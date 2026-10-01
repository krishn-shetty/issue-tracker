import { api } from "../../lib/axios";

export async function getUsers(params) {
  const { data } = await api.get("/users", { params });
  return { items: data.data, pagination: data.pagination };
}