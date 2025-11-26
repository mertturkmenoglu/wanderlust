import { BentoCache, bentostore } from "bentocache";
import { memoryDriver } from "bentocache/drivers/memory";
import superjson from "superjson";
import { ConfigServiceProvider, type TConfig } from "../config";
import { Container, type IServiceProvider } from "../di";

export class CacheServiceProvider implements IServiceProvider<TCacheService> {
  createInstance(ioc: Container) {
    const cfg = ioc.resolve(ConfigServiceProvider.getIdentifier());
    return init(cfg);
  }

  static getIdentifier() {
    return Container.createIdentifier<TCacheService>();
  }
}

function init(cfg: TConfig) {
  return new BentoCache({
    default: "cache",
    grace: cfg.cache.grace,
    graceBackoff: cfg.cache.graceBackoff,
    serializer: {
      serialize: superjson.stringify,
      deserialize: superjson.parse,
    },
    stores: {
      cache: bentostore().useL1Layer(
        memoryDriver({ maxSize: cfg.cache.l1MaxSize })
      ),
    },
  });
}

export type TCacheService = ReturnType<typeof init>;
