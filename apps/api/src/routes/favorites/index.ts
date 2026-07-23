import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { CreateFavoriteMethod } from './methods/create';
import { DeleteFavoriteMethod } from './methods/delete';
import { ListFavoritesMethod } from './methods/list';
import { ListFavoritesByUsernameMethod } from './methods/list-by-username';
import { FavoriteStatusProvider } from './provides/status';
import { os } from './shared/router';

export const module = defineModule({
	exports: [
		ListFavoritesMethod,
		CreateFavoriteMethod,
		DeleteFavoriteMethod,
		ListFavoritesByUsernameMethod,
		FavoriteStatusProvider,
	],
	router: () => {
		const list = container.get(ListFavoritesMethod);
		const create = container.get(CreateFavoriteMethod);
		const del = container.get(DeleteFavoriteMethod);
		const listByUsername = container.get(ListFavoritesByUsernameMethod);

		return os.router({
			list: list.route(),
			create: create.route(),
			delete: del.route(),
			listByUsername: listByUsername.route(),
		});
	},
});
