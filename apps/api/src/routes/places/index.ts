import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { DeletePlaceMethod } from './methods/delete';
import { GetPlaceMethod } from './methods/get';
import { ListPlacesMethod } from './methods/list';
import { UpdatePlaceMethod } from './methods/update';
import { os } from './shared/router';

export const module = defineModule({
	exports: [
		GetPlaceMethod,
		ListPlacesMethod,
		UpdatePlaceMethod,
		DeletePlaceMethod,
	],
	router: () => {
		const get = container.get(GetPlaceMethod);
		const list = container.get(ListPlacesMethod);
		const update = container.get(UpdatePlaceMethod);
		const del = container.get(DeletePlaceMethod);

		return os.router({
			get: get.route(),
			list: list.route(),
			update: update.route(),
			delete: del.route(),
		});
	},
});
