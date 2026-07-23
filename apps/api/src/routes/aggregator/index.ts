import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { AggregateHomeMethod } from './methods/home';
import { os } from './shared/router';

export const module = defineModule({
	exports: [AggregateHomeMethod],
	router: () => {
		const home = container.get(AggregateHomeMethod);

		return os.router({
			home: home.route(),
		});
	},
});
