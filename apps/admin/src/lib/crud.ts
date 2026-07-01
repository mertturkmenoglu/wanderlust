import type {
	DefaultError,
	UseMutationResult,
	UseQueryResult,
} from '@tanstack/react-query';
import type { LinkOptions } from '@tanstack/react-router';
import type { Inputs, Outputs } from './orpc';

export type ResourceKey = keyof Inputs;

// Extract a procedure's input/output, or `never` if it doesn't exist
export type ProcIn<K extends keyof Inputs, P extends string> =
	Inputs[K] extends Record<P, infer T> ? T : never;

export type ProcOut<K extends keyof Outputs, P extends string> =
	Outputs[K] extends Record<P, infer T> ? T : never;

export type DataResource<TKey extends ResourceKey, TOne> = {
	resource: TKey;
	breadcrumb?: string | ((data: ProcOut<TKey, 'get'>) => string);

	links: {
		list: LinkOptions;
		details: (id: string) => LinkOptions;
		new: LinkOptions;
		edit: (id: string) => LinkOptions;
	};

	extractors: {
		id: (data: TOne) => string;
		one: (data: ProcOut<TKey, 'get'>) => TOne;
		list: (data: ProcOut<TKey, 'list'>) => TOne[];
		title: (data: TOne) => string | undefined;
		description: (data: TOne) => string | undefined;
		appLink: (data: TOne) => string | undefined;
	};

	useOne: (
		input: ProcIn<TKey, 'get'>,
	) => UseQueryResult<ProcOut<TKey, 'get'>, DefaultError>;

	useList: (
		input: Record<never, never>,
	) => UseQueryResult<ProcOut<TKey, 'list'>, DefaultError>;

	useCreate: () => UseMutationResult<
		ProcOut<TKey, 'create'>,
		DefaultError,
		ProcIn<TKey, 'create'>
	>;

	useUpdate: () => UseMutationResult<
		ProcOut<TKey, 'update'>,
		DefaultError,
		ProcIn<TKey, 'update'>
	>;

	useDelete: () => UseMutationResult<
		ProcOut<TKey, 'delete'>,
		DefaultError,
		ProcIn<TKey, 'delete'>
	>;
};

export function defineResource<K extends ResourceKey, TOne>(
	r: DataResource<K, TOne>,
): DataResource<K, TOne> {
	return r;
}

export function getDefaultLinks(resource: ResourceKey) {
	return {
		list: {
			to: `/dashboard/${resource}`,
		} as LinkOptions,
		details: (id: string) =>
			({
				to: `/dashboard/${resource}/$id`,
				params: { id },
			}) as LinkOptions,
		new: {
			to: `/dashboard/${resource}/new`,
		} as LinkOptions,
		edit: (id: string) =>
			({
				to: `/dashboard/${resource}/$id/edit`,
				params: { id },
			}) as LinkOptions,
	};
}
