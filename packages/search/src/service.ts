import type { ConfigService } from '@wanderlust/config';
import Typesense from 'typesense';

export function createSearch(deps: { cfg: ConfigService }) {
	return new Typesense.Client({
		nodes: [
			{
				url: deps.cfg.typesense.url,
			},
		],
		apiKey: deps.cfg.typesense.apiKey,
	});
}

export type SearchService = ReturnType<typeof createSearch>;
