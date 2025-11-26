import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "../../db/schema";
import { Container, type IServiceProvider } from "../di";
import { DatabaseServiceProvider, type TDatabaseService } from "@/db";
import { ConfigServiceProvider, type TConfig } from "../config";
import { DurableServiceProvider, type TDurableService } from "../durable";

export class AuthServiceProvider implements IServiceProvider<TAuthService> {
  createInstance(ioc: Container) {
    const db = ioc.resolve(DatabaseServiceProvider.getIdentifier());
    const durable = ioc.resolve(DurableServiceProvider.getIdentifier());
    const cfg = ioc.resolve(ConfigServiceProvider.getIdentifier());
    return init(db, durable, cfg);
  }

  static getIdentifier() {
    return Container.createIdentifier<TAuthService>();
  }
}

function init(db: TDatabaseService, durable: TDurableService, cfg: TConfig) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: schema,
      usePlural: true,
    }),
    trustedOrigins: cfg.cors.allowedOrigins,
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ url, user }) => {
        await durable.send({
          name: "emails/send-reset-password",
          data: {
            email: user.email,
            url,
          },
        });
      },
    },
    advanced: {
      defaultCookieAttributes: {
        sameSite: "Lax",
        secure: true,
        httpOnly: true,
      },
    },
  });
}

export type TAuthService = ReturnType<typeof init>;
