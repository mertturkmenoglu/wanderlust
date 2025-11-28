import { type GetEvents, Inngest } from "inngest";
import { ConfigProvider, type TConfig } from "../config";
import { schemas } from "./schemas";
import { Container, type IServiceProvider } from "../di";

export class DurableProvider implements IServiceProvider<TDurableService> {
  constructor(ioc: Container) {
    const cfg = ioc.resolve(ConfigProvider.id);
    return init(cfg);
  }

  static get id() {
    return Container.createIdentifier<TDurableService>("durable");
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
