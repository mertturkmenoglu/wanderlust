/** biome-ignore-all lint/suspicious/noExplicitAny: any usage here is intentional */
import type { QueryClient } from '@tanstack/react-query';
import type { DataResource, ResourceKey } from './crud';

export function getDefaultStaticData<TKey extends ResourceKey, TOne>(
	resource: DataResource<TKey, TOne>,
	path: 'list' | 'details' | 'new' | 'edit',
) {
	if (path === 'list') {
		return {
			breadcrumbs: () => resource.breadcrumbs.list(),
		};
	}
	if (path === 'details') {
		return {
			breadcrumbs: (data: any) =>
				resource.breadcrumbs.details(resource.extractors.one(data)),
		};
	}
	if (path === 'new') {
		return {
			breadcrumbs: () => resource.breadcrumbs.new(),
		};
	}
	if (path === 'edit') {
		return {
			breadcrumbs: (data: any) =>
				resource.breadcrumbs.edit(resource.extractors.one(data)),
		};
	}

	throw new Error(`Invalid path: ${path}`);
}

export function ensureData<TKey extends ResourceKey, TOne>(
	r: DataResource<TKey, TOne>,
	qc: QueryClient,
	opts: Parameters<ReturnType<typeof r.options.one>['queryOptions']>[0],
) {
	// @ts-expect-error I wish I could solve this type issue.
	return qc.ensureQueryData(r.options.one().queryOptions(opts));
}
