import { AppType } from "#/index";
import { CreateEventDto } from "#/routes/events/dto";
import { CreateLocationDto } from "#/routes/locations/dto";
import { hc } from "hono/client";

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

export async function createNewLocation(payload: CreateLocationDto) {
  const res = await api.locations.$post({
    json: payload,
  });

  if (!res.ok) {
    throw new Error("Error");
  }

  const { data } = await res.json();
  return data;
}

export async function createNewEvent(payload: CreateEventDto) {
  const res = await api.events.$post({
    json: payload,
  });

  if (!res.ok) {
    throw new Error("Error");
  }

  const { data } = await res.json();
  return data;
}

export async function getLocations() {
  const res = await api.locations.peek.$get();

  if (!res.ok) {
    throw new Error("Error");
  }

  const { data } = await res.json();
  return data;
}

export async function getEvents() {
  const res = await api.events.peek.$get();

  if (!res.ok) {
    throw new Error("Error");
  }

  const { data } = await res.json();
  return data;
}
