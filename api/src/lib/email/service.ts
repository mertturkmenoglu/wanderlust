import { ConfigServiceProvider, type TConfig } from "../config";
import { Container, type IServiceProvider } from "../di";
import nodemailer from "nodemailer";

export class EmailServiceProvider implements IServiceProvider<TEmailService> {
  createInstance(ioc: Container) {
    const cfg = ioc.resolve(ConfigServiceProvider.getIdentifier());
    return init(cfg);
  }

  static getIdentifier() {
    return Container.createIdentifier<TEmailService>();
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
