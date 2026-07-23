import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { CheckHealthMethod } from './methods/check';
import { os } from './shared/router';

export const module = defineModule({
	exports: [CheckHealthMethod],
	router: () => {
		const check = container.get(CheckHealthMethod);

		return os.router({
			check: check.route(),
		});
	},
});
