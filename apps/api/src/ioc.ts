import { AuthProvider as AuthProvider } from "./lib/auth";
import { CacheProvider as CacheProvider } from "./lib/cache/service";
import { ConfigProvider as ConfigProvider } from "./lib/config";
import { DurableProvider as DurableProvider } from "./lib/durable/service";
import { EmailProvider as EmailProvider } from "./lib/email/service";
import { StorageProvider as StorageProvider } from "./lib/storage/service";
import { DbProvider as DatabaseProvider } from "./db";
import { Container } from "./lib/di";

export const ioc = new Container();

export async function bootstrapServices() {
  await ioc.provideAsync(ConfigProvider.id, ConfigProvider.createInstance(ioc));
  ioc.provide(DatabaseProvider.id, new DatabaseProvider(ioc));
  ioc.provide(DurableProvider.id, new DurableProvider(ioc));
  ioc.provide(StorageProvider.id, new StorageProvider(ioc));
  ioc.provide(EmailProvider.id, new EmailProvider(ioc));
  ioc.provide(CacheProvider.id, new CacheProvider(ioc));
  ioc.provide(AuthProvider.id, new AuthProvider(ioc));
}
