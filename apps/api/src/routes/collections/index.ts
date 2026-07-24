import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { os } from './internal/router';
import { CreateCollectionMethod } from './methods/create';
import { DeleteCollectionMethod } from './methods/delete';
import { GetCollectionMethod } from './methods/get';
import { ItemsUpdateMethod } from './methods/items-update';
import { ListCollectionsMethod } from './methods/list';
import { ListCitiesForCollectionMethod } from './methods/list-cities-for-collection';
import { ListCollectionsForCityMethod } from './methods/list-for-city';
import { ListCollectionsForPlaceMethod } from './methods/list-for-place';
import { ListPlacesForCollectionMethod } from './methods/list-places-for-collection';
import { UpdateCollectionMethod } from './methods/update';
import { UpdateCollectionsForCityMethod } from './methods/update-for-city';
import { UpdateCollectionsForPlaceMethod } from './methods/update-for-place';
import { CollectionProvider } from './provides/collection';

export const module = defineModule({
	exports: [
		GetCollectionMethod,
		ListCollectionsMethod,
		CreateCollectionMethod,
		UpdateCollectionMethod,
		DeleteCollectionMethod,
		ItemsUpdateMethod,
		ListCollectionsForPlaceMethod,
		UpdateCollectionsForPlaceMethod,
		ListCollectionsForCityMethod,
		UpdateCollectionsForCityMethod,
		ListPlacesForCollectionMethod,
		ListCitiesForCollectionMethod,
		CollectionProvider,
	],
	router: () => {
		const get = container.get(GetCollectionMethod);
		const list = container.get(ListCollectionsMethod);
		const create = container.get(CreateCollectionMethod);
		const update = container.get(UpdateCollectionMethod);
		const del = container.get(DeleteCollectionMethod);
		const itemsUpdate = container.get(ItemsUpdateMethod);
		const listCollectionsForPlace = container.get(
			ListCollectionsForPlaceMethod,
		);
		const updateCollectionsForPlace = container.get(
			UpdateCollectionsForPlaceMethod,
		);
		const listCollectionsForCity = container.get(ListCollectionsForCityMethod);
		const updateCollectionsForCity = container.get(
			UpdateCollectionsForCityMethod,
		);
		const listPlacesForCollection = container.get(
			ListPlacesForCollectionMethod,
		);
		const listCitiesForCollection = container.get(
			ListCitiesForCollectionMethod,
		);

		return os.router({
			get: get.route(),
			list: list.route(),
			create: create.route(),
			update: update.route(),
			delete: del.route(),
			items: os.items.router({
				update: itemsUpdate.route(),
			}),
			places: os.places.router({
				list: listCollectionsForPlace.route(),
				update: updateCollectionsForPlace.route(),
			}),
			cities: os.cities.router({
				list: listCollectionsForCity.route(),
				update: updateCollectionsForCity.route(),
			}),
			relations: os.relations.router({
				places: listPlacesForCollection.route(),
				cities: listCitiesForCollection.route(),
			}),
		});
	},
});
