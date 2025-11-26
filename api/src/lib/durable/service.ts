import { type GetEvents, Inngest } from "inngest";
import { ConfigServiceProvider, type TConfig } from "../config";
import { schemas } from "./schemas";
import { Container, type IServiceProvider } from "../di";

export class DurableServiceProvider
  implements IServiceProvider<TDurableService>
{
  createInstance(ioc: Container) {
    const cfg = ioc.resolve(ConfigServiceProvider.getIdentifier());
    return init(cfg);
  }

  static getIdentifier() {
    return Container.createIdentifier<TDurableService>();
  }
}

function init(cfg: TConfig) {
  return new Inngest({
    id: cfg.durable.id,
    env: process.env.NODE_ENV,
    appVersion: cfg.durable.appVersion,
    isDev: process.env.NODE_ENV === "development",
    schemas,
  });
}

export type TDurableService = ReturnType<typeof init>;

export type Event = GetEvents<ReturnType<typeof init>>;
