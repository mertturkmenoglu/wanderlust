import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { CreateCityMethod } from './methods/create';
import { DeleteCityMethod } from './methods/delete';
import { GetCityMethod } from './methods/get';
import { ListCitiesMethod } from './methods/list';
import { ListFeaturedCitiesMethod } from './methods/list-featured';
import { UpdateCityMethod } from './methods/update';
import { os } from './shared/router';

export const module = defineModule({
	exports: [
		GetCityMethod,
		ListCitiesMethod,
		ListFeaturedCitiesMethod,
		CreateCityMethod,
		UpdateCityMethod,
		DeleteCityMethod,
	],
	router: () => {
		const get = container.get(GetCityMethod);
		const list = container.get(ListCitiesMethod);
		const listFeatured = container.get(ListFeaturedCitiesMethod);
		const create = container.get(CreateCityMethod);
		const update = container.get(UpdateCityMethod);
		const del = container.get(DeleteCityMethod);

		return os.router({
			list: list.route(),
			listFeatured: listFeatured.route(),
			get: get.route(),
			create: create.route(),
			update: update.route(),
			delete: del.route(),
		});
	},
});
