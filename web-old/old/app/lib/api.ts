import ky, { HTTPError } from "ky";

const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  retry: 0,
});

export function isApiError<T>(e: Error): e is HTTPError<T> {
  return e.name === "HTTPError";
}

export default api;

export * from "./api-requests";
export * from "./api-status";
