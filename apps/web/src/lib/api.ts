import { createAddressSchema } from "#/routes/dto/create-address";
import { createEventSchema } from "#/routes/dto/create-event";
import { createLocationSchema } from "#/routes/dto/create-location";
import { hc, InferResponseType } from "hono/client";
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

type CreateNewEventPayload = z.infer<typeof createEventSchema>;

export async function createNewEvent(payload: CreateNewEventPayload) {
  const res = await api.events.$post({
    json: payload,
  });

  if (!res.ok) {
    throw new Error("Error");
  }

  const { data } = await res.json();
  return data;
}

type CreateNewAddressPayload = z.infer<typeof createAddressSchema>;

export async function createNewAddress(payload: CreateNewAddressPayload) {
  const res = await api.addresses.$post({
    json: payload,
  });

  if (!res.ok) {
    throw new Error("Error");
  }

  const { data } = await res.json();
  return data;
}

const fnRef = api.addresses[":id"].$get;

export type Address = InferResponseType<typeof fnRef>["data"];

export async function searchAddress(q: string) {
  const res = await api.addresses.search.$get({
    query: {
      q,
    },
  });

  if (!res.ok) {
    throw new Error("Error");
  }

  const { data } = await res.json();
  return data;
}

export async function getLocations() {
  const res = await api.locations.all.$get();

  if (!res.ok) {
    throw new Error("Error");
  }

  const { data } = await res.json();
  return data;
}

export async function getEvents() {
  const res = await api.events.all.$get();

  if (!res.ok) {
    throw new Error("Error");
  }

  const { data } = await res.json();
  return data;
}

export async function getAddresses() {
  const res = await api.addresses.all.$get();

  if (!res.ok) {
    throw new Error("Error");
  }

  const { data } = await res.json();
  return data;
}
