import type { RouterClient } from "@orpc/server";
import { router as healthRouter } from "./health";
import { getRouter as getCategoriesRouter } from "./categories";
import { getRouter as getCitiesRouter } from "./cities";
import { getRouter as getPlacesRouter } from "./places";

export function getAppRouter() {
  return {
    health: healthRouter,
    categories: getCategoriesRouter(),
    cities: getCitiesRouter(),
    places: getPlacesRouter(),
  };
}

export type AppRouter = ReturnType<typeof getAppRouter>;
export type AppRouterClient = RouterClient<AppRouter>;
