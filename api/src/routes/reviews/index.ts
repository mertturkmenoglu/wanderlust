import { implement } from "@orpc/server";
import { contract } from "./contract";
import type { Context } from "@/lib/context";
import { DbProvider } from "@/db";
import { ReviewsRepository } from "./repository";
import { ReviewsService } from "./service";
import { ioc } from "@/ioc";
import { requireAuth } from "@/middlewares/authn";

export function getRouter() {
  const os = implement(contract).$context<Context>();
  const db = ioc.resolve(DbProvider.id);
  const repo = new ReviewsRepository(db);
  const service = new ReviewsService(repo);

  return os.router({
    get: os.get.handler(async ({ input }) => {
      const result = await service.get(input);

      return result;
    }),
    create: os.create.use(requireAuth).handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const result = await service.create(userId, input);

      return result;
    }),
    delete: os.delete.use(requireAuth).handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      await service._delete(userId, input);

      return {};
    }),
    listByUsername: os.listByUsername.handler(async ({ input }) => {
      const result = await service.listByUsername(input);

      return result;
    }),
    listByPlaceId: os.listByPlaceId.handler(async ({ input }) => {
      const result = await service.listByPlaceId(input);

      return result;
    }),
    getRatings: os.getRatings.handler(async ({ input }) => {
      const result = await service.getRatings(input);

      return result;
    }),
    listAssetsByPlaceId: os.listAssetsByPlaceId.handler(async ({ input }) => {
      const result = await service.listAssetsByPlaceId(input);

      return result;
    }),
  });
}
