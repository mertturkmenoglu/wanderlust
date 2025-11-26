import type { RouterClient } from "@orpc/server";
import { router as healthRouter } from "./health";
import { getRouter } from "./categories";

export function getAppRouter() {
  return {
    health: healthRouter,
    categories: getRouter(),
  };
}

export type AppRouter = ReturnType<typeof getAppRouter>;
export type AppRouterClient = RouterClient<AppRouter>;
