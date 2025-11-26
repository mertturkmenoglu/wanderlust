import { DatabaseServiceProvider } from "./db";
import { AuthServiceProvider } from "./lib/auth";
import { CacheServiceProvider } from "./lib/cache";
import { ConfigServiceProvider } from "./lib/config";
import { Container } from "./lib/di";
import { DurableServiceProvider } from "./lib/durable";
import { EmailServiceProvider } from "./lib/email/service";

export async function bootstrapServices() {
  const ioc = new Container();

  ioc.provideAsync(
    ConfigServiceProvider.getIdentifier(),
    new ConfigServiceProvider().createInstance(ioc)
  );

  ioc.provide(
    CacheServiceProvider.getIdentifier(),
    new CacheServiceProvider().createInstance(ioc)
  );

  ioc.provide(
    DatabaseServiceProvider.getIdentifier(),
    new DatabaseServiceProvider().createInstance(ioc)
  );

  ioc.provide(
    EmailServiceProvider.getIdentifier(),
    new EmailServiceProvider().createInstance(ioc)
  );

  ioc.provide(
    DurableServiceProvider.getIdentifier(),
    new DurableServiceProvider().createInstance(ioc)
  );

  ioc.provide(
    AuthServiceProvider.getIdentifier(),
    new AuthServiceProvider().createInstance(ioc)
  );

  return ioc;
}
