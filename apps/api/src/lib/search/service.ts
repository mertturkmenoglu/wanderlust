import Typesense from 'typesense';
import { ioc } from '@/ioc';
import { ConfigProvider } from '../config';
import { Container, type IServiceProvider } from '../di';

export class SearchProvider implements IServiceProvider<TSearchService> {
	private readonly instance: TSearchService;

	constructor(ioc: Container) {
		this.instance = init(ioc);
	}

	get(): TSearchService {
		return this.instance;
	}

	static get id() {
		return Container.createIdentifier<TSearchService>('search');
	}
}

function init(_ioc: Container) {
	const cfg = ioc.resolve(ConfigProvider.id);
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
