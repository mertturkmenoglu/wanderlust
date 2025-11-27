import { implement } from "@orpc/server";
import type { AuthContext } from "@/lib/context";
import { contract } from "./contract";
import { DbProvider } from "@/db";
import { ioc } from "@/ioc";
import { requireAuth } from "@/middlewares/authn";
import { ListsRepository } from "./repository";
import { ListsService } from "./service";

export function getRouter() {
  const os = implement(contract).$context<AuthContext>().use(requireAuth);
  const db = ioc.resolve(DbProvider.id);
  const repo = new ListsRepository(db);
  const service = new ListsService(repo);

  return os.router({
    listAll: os.listAll.handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const result = await service.listAll(userId, input);

      return result;
    }),
    listPublic: os.listPublic.handler(async ({ input }) => {
      const result = await service.listPublic(input);

      return result;
    }),
    get: os.get.handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const result = await service.get(userId, input);

      return result;
    }),
    checkStatus: os.checkStatus.handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const result = await service.checkStatus(userId, input);

      return result;
    }),
    create: os.create.handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const result = await service.create(userId, input);

      return result;
    }),
    update: os.update.handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const result = await service.update(userId, input);

      return result;
    }),
    delete: os.delete.handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      await service._delete(userId, input);

      return {};
    }),
    appendItem: os.appendItem.handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const result = await service.appendItem(userId, input);

      return result;
    }),
    updateItems: os.updateItems.handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const result = await service.updateItems(userId, input);

      return result;
    }),
    removeItem: os.removeItem.handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const result = await service.removeItem(userId, input);

      return result;
    }),
  });
}
