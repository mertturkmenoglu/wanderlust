import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { os } from './internal/router';
import { ListAmenitiesMethod } from './methods/list';

export const module = defineModule({
	exports: [ListAmenitiesMethod],
	router: () => {
		const list = container.get(ListAmenitiesMethod);

		return os.router({
			list: list.route(),
		});
	},
});
