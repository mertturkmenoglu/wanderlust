import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "../../db/schema";
import { Container, type IServiceProvider } from "../di";
import { DbProvider, type TDatabaseService } from "@/db";
import { type TConfig, ConfigProvider} from "../config";
import {
  type TDurableService,
  DurableProvider,
} from "../durable";

export class AuthProvider implements IServiceProvider<TAuthService> {
  constructor(ioc: Container) {
    const db = ioc.resolve(DbProvider.id);
    const durable = ioc.resolve(DurableProvider.id);
    const cfg = ioc.resolve(ConfigProvider.id);
    return init(db, durable, cfg);
  }

  static get id() {
    return Container.createIdentifier<TAuthService>("auth");
  }
}

function init(db: TDatabaseService, durable: TDurableService, cfg: TConfig) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: schema,
      usePlural: true,
    }),
    user: {
      // TODO: Investigate why defining these columns in the Drizzle table doesn't automatically
      // add them to the user object and if there's a way to do it, we should do it.
      //
      // TODO: Adding required: false makes the field string | null | undefined, which is not ideal.
      // We want string | null.
      additionalFields: {
        username: {
          type: "string",
          input: true,
        },
        banner: {
          type: "string",
          input: false,
          required: false,
        },
        bio: {
          type: "string",
          input: true,
          required: false,
        },
        website: {
          type: "string",
          input: true,
          required: false,
        },
        followersCount: {
          type: "number",
          input: false,
          required: false,
        },
        followingCount: {
          type: "number",
          input: false,
          required: false,
        },
      },
    },
    trustedOrigins: cfg.cors.allowedOrigins,
    appName: "Wanderlust",
    experimental: {
      joins: true,
    },
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
