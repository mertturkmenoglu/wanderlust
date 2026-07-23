import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { CreateAssetMethod } from './methods/create';
import { CreateManyAssetsMethod } from './methods/create-many';
import { os } from './shared/router';

export const module = defineModule({
	exports: [CreateAssetMethod, CreateManyAssetsMethod],
	router: () => {
		const create = container.get(CreateAssetMethod);
		const createMany = container.get(CreateManyAssetsMethod);

		return os.router({
			create: create.route(),
			createMany: createMany.route(),
		});
	},
});
