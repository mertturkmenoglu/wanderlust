import { hc } from "hono/client";
import type { AppType } from "../../../api/src";

export const { api } = hc<AppType>("http://localhost:5000");

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
