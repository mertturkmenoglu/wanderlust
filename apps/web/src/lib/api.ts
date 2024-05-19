import { hc } from "hono/client";
import type { AppType } from "../../../api/src";

export const { api } = hc<AppType>(process.env.API_URL!);

export async function getUserProfile(username: string) {
  const res = await api.users[":username"].profile.$get({
    param: {
      username: username,
    },
  });

  if (!res.ok) {
    throw new Error("Error");
  }

  const { data } = await res.json();
  return data;
}

export async function getCategories() {
  const res = await api.categories.$get();

  if (!res.ok) {
    throw new Error("Error");
  }

  const { data } = await res.json();
  return data;
}
