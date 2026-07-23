import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { GetPreferencesMethod } from './methods/get';
import { UpdatePreferencesMethod } from './methods/update';
import { os } from './shared/router';

export const module = defineModule({
	exports: [GetPreferencesMethod, UpdatePreferencesMethod],
	router: () => {
		const get = container.get(GetPreferencesMethod);
		const update = container.get(UpdatePreferencesMethod);

		return os.router({
			get: get.route(),
			update: update.route(),
		});
	},
});
