import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { os } from './internal/router';
import { AggregateHomeMethod } from './methods/home';

export const module = defineModule({
	exports: [AggregateHomeMethod],
	router: () => {
		const home = container.get(AggregateHomeMethod);

		return os.router({
			home: home.route(),
		});
	},
});
