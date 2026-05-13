import { Container } from 'inversify';
import { AuthService } from './lib/auth';
import { CacheService } from './lib/cache';
import { ConfigService, type TConfigService } from './lib/config';
import { DatabaseService } from './lib/db';
import { EmailService } from './lib/email';
import { JobsService } from './lib/jobs';
import { SearchService } from './lib/search';
import { StorageService } from './lib/storage';
import { AggregatorRepository } from './routes/aggregator/repository';
import { AggregatorService } from './routes/aggregator/service';
import { BookmarksRepository } from './routes/bookmarks/repository';
import { BookmarksService } from './routes/bookmarks/service';
import { CategoriesRepository } from './routes/categories/repository';
import { CategoriesService } from './routes/categories/service';
import { CitiesRepository } from './routes/cities/repository';
import { CitiesService } from './routes/cities/service';
import { CollectionsRepository } from './routes/collections/repository';
import { CollectionsService } from './routes/collections/service';
import { EventsRepository } from './routes/events/repository';
import { EventsService } from './routes/events/service';
import { FavoritesRepository } from './routes/favorites/repository';
import { FavoritesService } from './routes/favorites/service';
import { ListsRepository } from './routes/lists/repository';
import { ListsService } from './routes/lists/service';
import { PlacesRepository } from './routes/places/repository';
import { PlacesService } from './routes/places/service';
import { ReportsRepository } from './routes/reports/repository';
import { ReportsService } from './routes/reports/service';
import { ReviewsRepository } from './routes/reviews/repository';
import { ReviewsService } from './routes/reviews/service';
import { TripsRepository } from './routes/trips/repository';
import { TripsService } from './routes/trips/service';
import { UsersRepository } from './routes/users/repository';
import { UsersService } from './routes/users/service';

export const container = new Container({
	autobind: true,
});

export async function bootstrapServices() {
	const configData = await ConfigService.init();

	container.bind<TConfigService>('TConfigService').toConstantValue(configData);
	container.bind<ConfigService>(ConfigService).toSelf().inSingletonScope();
	container.get(ConfigService).set(configData);

	container.bind(DatabaseService).toSelf().inSingletonScope();
	container.bind(StorageService).toSelf();
	container.bind(EmailService).toSelf();
	container.bind(CacheService).toSelf();
	container.bind(JobsService).toSelf();
	container.bind(AuthService).toSelf();
	container.bind(SearchService).toSelf();

	container.bind(AggregatorRepository).toSelf();
	container.bind(AggregatorService).toSelf();

	container.bind(BookmarksRepository).toSelf();
	container.bind(BookmarksService).toSelf();

	container.bind(CategoriesRepository).toSelf();
	container.bind(CategoriesService).toSelf();

	container.bind(CitiesRepository).toSelf();
	container.bind(CitiesService).toSelf();

	container.bind(CollectionsRepository).toSelf();
	container.bind(CollectionsService).toSelf();

	container.bind(EventsRepository).toSelf();
	container.bind(EventsService).toSelf();

	container.bind(FavoritesRepository).toSelf();
	container.bind(FavoritesService).toSelf();

	container.bind(ListsRepository).toSelf();
	container.bind(ListsService).toSelf();

	container.bind(PlacesRepository).toSelf();
	container.bind(PlacesService).toSelf();

	container.bind(ReportsRepository).toSelf();
	container.bind(ReportsService).toSelf();

	container.bind(ReviewsRepository).toSelf();
	container.bind(ReviewsService).toSelf();

	container.bind(TripsRepository).toSelf();
	container.bind(TripsService).toSelf();

	container.bind(UsersRepository).toSelf();
	container.bind(UsersService).toSelf();
}
