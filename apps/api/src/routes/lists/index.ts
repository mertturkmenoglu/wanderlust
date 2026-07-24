import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { CreateListMethod } from './methods/create';
import { DeleteListMethod } from './methods/delete';
import { GetListMethod } from './methods/get';
import { UpdateListItemsMethod } from './methods/items-update';
import { ListAllMethod } from './methods/list';
import { ListPlaceSaveStatMethod } from './methods/list-place-save-stat';
import { ListPublicMethod } from './methods/list-public';
import { UpdateListMethod } from './methods/update';
import { ListProvider } from './provides/list';
import { os } from './shared/router';

export const module = defineModule({
	exports: [
		ListAllMethod,
		ListPublicMethod,
		GetListMethod,
		ListPlaceSaveStatMethod,
		CreateListMethod,
		UpdateListMethod,
		DeleteListMethod,
		UpdateListItemsMethod,
		ListProvider,
	],
	router: () => {
		const listAll = container.get(ListAllMethod);
		const listPublic = container.get(ListPublicMethod);
		const get = container.get(GetListMethod);
		const listPlaceSaveStat = container.get(ListPlaceSaveStatMethod);
		const create = container.get(CreateListMethod);
		const update = container.get(UpdateListMethod);
		const del = container.get(DeleteListMethod);
		const updateItems = container.get(UpdateListItemsMethod);

		return os.router({
			list: listAll.route(),
			listPublic: listPublic.route(),
			get: get.route(),
			listPlaceSaveStat: listPlaceSaveStat.route(),
			create: create.route(),
			update: update.route(),
			delete: del.route(),
			items: {
				update: updateItems.route(),
			},
		});
	},
});
