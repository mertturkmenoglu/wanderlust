import { ConfigService, type TConfigService } from '@wanderlust/config';
import { inject, injectable } from 'inversify';
import Typesense from 'typesense';

@injectable()
export class SearchService {
	private readonly instance: TSearchService;

	constructor(@inject(ConfigService) private readonly cfg: ConfigService) {
		this.instance = init(this.cfg.get());
	}

	get(): TSearchService {
		return this.instance;
	}
}

function init(cfg: TConfigService) {
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
