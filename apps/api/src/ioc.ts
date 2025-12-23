import { DbProvider as DatabaseProvider } from './db';
import { AuthProvider } from './lib/auth';
import { CacheProvider } from './lib/cache';
import { ConfigProvider } from './lib/config';
import { Container } from './lib/di';
import { EmailProvider } from './lib/email';
import { JobsProvider } from './lib/jobs';
import { SearchProvider } from './lib/search';
import { StorageProvider } from './lib/storage';

export const ioc = new Container();

export async function bootstrapServices() {
	await ioc.provideAsync(ConfigProvider.id, ConfigProvider.createInstance(ioc));
	ioc.provide(DatabaseProvider.id, new DatabaseProvider(ioc).get());
	ioc.provide(StorageProvider.id, new StorageProvider(ioc).get());
	ioc.provide(EmailProvider.id, new EmailProvider(ioc).get());
	ioc.provide(CacheProvider.id, new CacheProvider(ioc).get());
	ioc.provide(JobsProvider.id, new JobsProvider(ioc).get());
	ioc.provide(AuthProvider.id, new AuthProvider(ioc).get());
	ioc.provide(SearchProvider.id, new SearchProvider(ioc).get());
}
