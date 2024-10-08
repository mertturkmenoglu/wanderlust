import ky from "ky";

const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  retry: 0,
});

export default api;

export * from "./api-requests";
export * from "./api-status";
