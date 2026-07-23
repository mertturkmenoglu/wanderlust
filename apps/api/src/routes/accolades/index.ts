import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { CreateAccoladeMethod } from './methods/create';
import { DeleteAccoladeMethod } from './methods/delete';
import { GetAccoladeMethod } from './methods/get';
import { ListAccoladesMethod } from './methods/list';
import { ListAccoladePlacesMethod } from './methods/list-places';
import { UpdateAccoladeMethod } from './methods/update';
import { os } from './shared/router';

export const module = defineModule({
	exports: [
		GetAccoladeMethod,
		ListAccoladesMethod,
		ListAccoladePlacesMethod,
		CreateAccoladeMethod,
		UpdateAccoladeMethod,
		DeleteAccoladeMethod,
	],
	router: () => {
		const get = container.get(GetAccoladeMethod);
		const list = container.get(ListAccoladesMethod);
		const listPlaces = container.get(ListAccoladePlacesMethod);
		const create = container.get(CreateAccoladeMethod);
		const update = container.get(UpdateAccoladeMethod);
		const del = container.get(DeleteAccoladeMethod);

		return os.router({
			create: create.route(),
			list: list.route(),
			delete: del.route(),
			get: get.route(),
			listPlaces: listPlaces.route(),
			update: update.route(),
		});
	},
});
