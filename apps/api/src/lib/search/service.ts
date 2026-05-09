import { injectable } from 'inversify';
import Typesense from 'typesense';
import { container } from '@/ioc';
import { ConfigService } from '../config';

@injectable()
export class SearchService {
	private readonly instance: TSearchService;

	constructor() {
		this.instance = init();
	}

	get(): TSearchService {
		return this.instance;
	}
}

function init() {
	const cfg = container.get(ConfigService).get();

	return new Typesense.Client({
		nodes: [
			{
				url: cfg.typesense.url,
			},
		],
		apiKey: cfg.typesense.apiKey,
	});
}

export type TSearchService = ReturnType<typeof init>;
