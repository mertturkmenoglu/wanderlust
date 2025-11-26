import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { ConfigServiceProvider, type TConfig } from "@/lib/config";
import { Container, type IServiceProvider } from "@/lib/di";

export class DatabaseServiceProvider
  implements IServiceProvider<TDatabaseService>
{
  createInstance(ioc: Container) {
    const cfg = ioc.resolve(ConfigServiceProvider.getIdentifier());
    return init(cfg);
  }

  static getIdentifier() {
    return Container.createIdentifier<TDatabaseService>();
  }
}

function init(cfg: TConfig) {
  return drizzle({
    connection: {
      connectionString: cfg.database.url,
      ssl: cfg.database.ssl,
    },
    schema,
  });
}

export type TDatabaseService = ReturnType<typeof init>;
