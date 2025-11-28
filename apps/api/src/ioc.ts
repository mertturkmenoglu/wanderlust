import { DbProvider as DatabaseProvider } from './db';
import { AuthProvider } from './lib/auth';
import { CacheProvider } from './lib/cache/service';
import { ConfigProvider } from './lib/config';
import { Container } from './lib/di';
import { DurableProvider } from './lib/durable/service';
import { EmailProvider } from './lib/email/service';
import { StorageProvider } from './lib/storage/service';

export const ioc = new Container();

export async function bootstrapServices() {
	await ioc.provideAsync(ConfigProvider.id, ConfigProvider.createInstance(ioc));
	ioc.provide(DatabaseProvider.id, new DatabaseProvider(ioc).get());
	ioc.provide(DurableProvider.id, new DurableProvider(ioc).get());
	ioc.provide(StorageProvider.id, new StorageProvider(ioc).get());
	ioc.provide(EmailProvider.id, new EmailProvider(ioc).get());
	ioc.provide(CacheProvider.id, new CacheProvider(ioc).get());
	ioc.provide(AuthProvider.id, new AuthProvider(ioc).get());
}
