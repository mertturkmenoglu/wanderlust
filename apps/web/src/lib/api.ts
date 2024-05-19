import { createLocationSchema } from "#/routes/dto/create-location";
import { hc } from "hono/client";
import { z } from "zod";
import type { AppType } from "../../../api/src";

export const { api } = hc<AppType>(process.env.NEXT_PUBLIC_API_URL!, {
  init: {
    credentials: "include",
  },
});

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

type CreateNewLocationPayload = z.infer<typeof createLocationSchema>;

export async function createNewLocation(payload: CreateNewLocationPayload) {
  const res = await api.locations.$post({
    json: payload,
  });

  if (!res.ok) {
    throw new Error("Error");
  }

  const { data } = await res.json();
  return data;
}
