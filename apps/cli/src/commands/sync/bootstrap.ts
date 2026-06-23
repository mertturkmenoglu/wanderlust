import { ConfigService } from '@wanderlust/config';
import { DatabaseService } from '@wanderlust/db';
import { SearchService } from '@wanderlust/search';
import { container } from './ioc';

export async function bootstrapServices() {
	container.bind(ConfigService).toSelf().inSingletonScope();
	container.bind(SearchService).toSelf();
	container.bind(DatabaseService).toSelf().inSingletonScope();
}
