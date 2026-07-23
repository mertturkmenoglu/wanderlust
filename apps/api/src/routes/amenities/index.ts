import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { ListAmenitiesMethod } from './methods/list';
import { os } from './shared/router';

export const module = defineModule({
	exports: [ListAmenitiesMethod],
	router: () => {
		const list = container.get(ListAmenitiesMethod);

		return os.router({
			list: list.route(),
		});
	},
});
