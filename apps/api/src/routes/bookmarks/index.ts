import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { os } from './internal/router';
import { CreateBookmarkMethod } from './methods/create';
import { DeleteBookmarkMethod } from './methods/delete';
import { ListBookmarksMethod } from './methods/list';

export const module = defineModule({
	exports: [ListBookmarksMethod, CreateBookmarkMethod, DeleteBookmarkMethod],
	router: () => {
		const list = container.get(ListBookmarksMethod);
		const create = container.get(CreateBookmarkMethod);
		const del = container.get(DeleteBookmarkMethod);

		return os.router({
			list: list.route(),
			create: create.route(),
			delete: del.route(),
		});
	},
});
