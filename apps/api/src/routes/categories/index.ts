import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { CreateCategoryMethod } from './methods/create';
import { DeleteCategoryMethod } from './methods/delete';
import { GetCategoryMethod } from './methods/get';
import { ListCategoriesMethod } from './methods/list';
import { UpdateCategoryMethod } from './methods/update';
import { os } from './shared/router';

export const module = defineModule({
	exports: [
		GetCategoryMethod,
		ListCategoriesMethod,
		CreateCategoryMethod,
		UpdateCategoryMethod,
		DeleteCategoryMethod,
	],
	router: () => {
		const get = container.get(GetCategoryMethod);
		const list = container.get(ListCategoriesMethod);
		const create = container.get(CreateCategoryMethod);
		const update = container.get(UpdateCategoryMethod);
		const del = container.get(DeleteCategoryMethod);

		return os.router({
			get: get.route(),
			list: list.route(),
			create: create.route(),
			update: update.route(),
			delete: del.route(),
		});
	},
});
