import { ConfigProvider, type TConfig } from "../config";
import { Container, type IServiceProvider } from "../di";
import nodemailer from "nodemailer";

export class EmailProvider implements IServiceProvider<TEmailService> {
  constructor(ioc: Container) {
    const cfg = ioc.resolve(ConfigProvider.id);
    return init(cfg);
  }

  static get id() {
    return Container.createIdentifier<TEmailService>("email");
  }
}

function init(cfg: TConfig) {
  return nodemailer.createTransport({
    host: cfg.email.host,
    port: cfg.email.port,
    secure: cfg.email.ssl,
  });
}

export type TEmailService = ReturnType<typeof init>;
