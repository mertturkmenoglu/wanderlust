import { DbProvider } from "@/db";
import { ioc } from "@/ioc";
import { AggregatorRepository } from "./repository";
import { AggregatorService } from "./service";
import { implement } from "@orpc/server";
import { contract } from "./contract";
import type { Context } from "@/lib/context";
import { CacheProvider } from "@/lib/cache";

export function getRouter() {
  const os = implement(contract).$context<Context>();
  const db = ioc.resolve(DbProvider.id);
  const cache = ioc.resolve(CacheProvider.id);
  const repo = new AggregatorRepository(db);
  const service = new AggregatorService(cache, repo);

  return os.router({
    home: os.home.handler(async () => {
      const result = await service.home();

      return result;
    }),
  });
}
