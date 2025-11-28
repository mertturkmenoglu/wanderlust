import { implement } from "@orpc/server";
import type { Context } from "@/lib/context";
import { contract } from "./contract";
import { DbProvider } from "@/db";
import { CitiesRepository } from "./repository";
import { CitiesService } from "./service";
import { ioc } from "@/ioc";
import { requireAuth } from "@/middlewares/authn";
import { isAdmin } from "@/middlewares/is-admin";

export function getRouter() {
  const os = implement(contract).$context<Context>();
  const db = ioc.resolve(DbProvider.id);
  const repo = new CitiesRepository(db);
  const service = new CitiesService(repo);

  return os.router({
    list: os.list.handler(async () => {
      const result = await service.list();

      return result;
    }),
    listFeatured: os.listFeatured.handler(async () => {
      const result = await service.listFeatured();

      return result;
    }),
    get: os.get.handler(async ({ input, errors }) => {
      const result = await service.get(input);

      return result;
    }),
    create: os.create
      .use(requireAuth)
      .use(isAdmin)
      .handler(async ({ input, context, errors }) => {
        if (!context.session?.user) {
          throw errors.UNAUTHORIZED();
        }

        const result = await service.create(input);

        return result;
      }),
    update: os.update
      .use(requireAuth)
      .use(isAdmin)
      .handler(async ({ input, context, errors }) => {
        if (!context.session?.user) {
          throw errors.UNAUTHORIZED();
        }

        const result = await service.update(input);

        return result;
      }),
    delete: os.delete
      .use(requireAuth)
      .use(isAdmin)
      .handler(async ({ input, context, errors }) => {
        if (!context.session?.user) {
          throw errors.UNAUTHORIZED();
        }

        await service._delete(input);

        return {};
      }),
  });
}
