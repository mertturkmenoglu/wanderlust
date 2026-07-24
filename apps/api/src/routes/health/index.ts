import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { os } from './internal/router';
import { CheckHealthMethod } from './methods/check';

export const module = defineModule({
	exports: [CheckHealthMethod],
	router: () => {
		const check = container.get(CheckHealthMethod);

		return os.router({
			check: check.route(),
		});
	},
});
