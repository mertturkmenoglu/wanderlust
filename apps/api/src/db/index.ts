import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { ConfigProvider, type TConfig } from "@/lib/config";
import { Container, type IServiceProvider } from "@/lib/di";

export class DbProvider implements IServiceProvider<TDatabaseService> {
  constructor(ioc: Container) {
    const cfg = ioc.resolve(ConfigProvider.id);
    return init(cfg);
  }

  static get id() {
    return Container.createIdentifier<TDatabaseService>("db");
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
