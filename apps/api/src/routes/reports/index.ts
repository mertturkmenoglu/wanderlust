import { container } from '@/ioc';
import { defineModule } from '@/lib/define-module';
import { CreateReportMethod } from './methods/create';
import { DeleteReportMethod } from './methods/delete';
import { GetReportMethod } from './methods/get';
import { ListReportsMethod } from './methods/list';
import { SearchReportsMethod } from './methods/search';
import { UpdateReportMethod } from './methods/update';
import { os } from './shared/router';

export const module = defineModule({
	exports: [
		GetReportMethod,
		ListReportsMethod,
		SearchReportsMethod,
		CreateReportMethod,
		UpdateReportMethod,
		DeleteReportMethod,
	],
	router: () => {
		const get = container.get(GetReportMethod);
		const list = container.get(ListReportsMethod);
		const search = container.get(SearchReportsMethod);
		const create = container.get(CreateReportMethod);
		const update = container.get(UpdateReportMethod);
		const del = container.get(DeleteReportMethod);

		return os.router({
			get: get.route(),
			list: list.route(),
			search: search.route(),
			create: create.route(),
			update: update.route(),
			delete: del.route(),
		});
	},
});
