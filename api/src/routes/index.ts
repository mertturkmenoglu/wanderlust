import type { RouterClient } from "@orpc/server";
import { getRouter as getBookmarksRouter } from "./bookmarks";
import { getRouter as getCategoriesRouter } from "./categories";
import { getRouter as getCitiesRouter } from "./cities";
import { getRouter as getFavoritesRouter } from "./favorites";
import { getRouter as getHealthRouter } from "./health";
import { getRouter as getPlacesRouter } from "./places";

export function getAppRouter() {
  return {
    bookmarks: getBookmarksRouter(),
    categories: getCategoriesRouter(),
    cities: getCitiesRouter(),
    favorites: getFavoritesRouter(),
    health: getHealthRouter(),
    places: getPlacesRouter(),
  };
}

export type AppRouter = ReturnType<typeof getAppRouter>;
export type AppRouterClient = RouterClient<AppRouter>;
