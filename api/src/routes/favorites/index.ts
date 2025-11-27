import { implement } from "@orpc/server";
import type { AuthContext } from "@/lib/context";
import { contract } from "./contract";
import { DbProvider } from "@/db";
import { ioc } from "@/ioc";
import { requireAuth } from "@/middlewares/authn";
import { FavoritesRepository } from "./repository";
import { FavoritesService } from "./service";

export function getRouter() {
  const os = implement(contract).$context<AuthContext>().use(requireAuth);
  const db = ioc.resolve(DbProvider.id);
  const repo = new FavoritesRepository(db);
  const service = new FavoritesService(repo);

  return os.router({
    list: os.list.handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const result = await service.list(userId, input);

      return result;
    }),
    create: os.create.handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const result = await service.create(userId, input);

      return result;
    }),
    delete: os.delete.handler(async ({ input, context, errors }) => {
      const userId = context.session.user.id;
      await service._delete(userId, input);

      return {};
    }),
    listByUsername: os.listByUsername.handler(async ({ input }) => {
      const result = await service.listByUsername(input);

      return result;
    }),
  });
}
