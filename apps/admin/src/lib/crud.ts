import type { ClientContext } from '@orpc/client';
import type { ProcedureUtils } from '@orpc/tanstack-query';
import type {
	DefaultError,
	UseMutationResult,
	UseQueryResult,
} from '@tanstack/react-query';
import type { LinkOptions } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import type { Inputs, Outputs } from './orpc';
import { toTitleCase } from './text';

export type ResourceKey = keyof Inputs;

export type ProcIn<K extends keyof Inputs, P extends string> =
	Inputs[K] extends Record<P, infer T> ? T : never;

export type ProcOut<K extends keyof Outputs, P extends string> =
	Outputs[K] extends Record<P, infer T> ? T : never;

export type TPagination = Outputs['bookmarks']['list']['pagination'];

export type TDataBreadcrumb = {
	label: string;
	link: LinkOptions;
};

export type TDataFn<
	TClientContext extends ClientContext,
	TInput,
	TOutput,
	TError,
> = () => ProcedureUtils<TClientContext, TInput, TOutput, TError>;

export type TDataBreadcrumbs<TOne> = {
	list: () => TDataBreadcrumb[];
	details: (data: TOne) => TDataBreadcrumb[];
	new: () => TDataBreadcrumb[];
	edit: (data: TOne) => TDataBreadcrumb[];
};

export type TDataLinks = {
	/**
	 * List items of this resource.
	 */
	list: LinkOptions;
	/**
	 * Details page for a single item of this resource.
	 */
	details: (id: string) => LinkOptions;
	/**
	 * New item page for this resource.
	 */
	new: LinkOptions;
	/**
	 * Edit page for a single item of this resource.
	 */
	edit: (id: string) => LinkOptions;
};

export type TDataExtractors<TKey extends ResourceKey, TOne> = {
	/**
	 * Extract the ID of a single item of this resource from the data returned by the "get" procedure.
	 */
	id: (data: TOne) => string;
	/**
	 * Extract a single item of this resource from the data returned by the "get" procedure.
	 */
	one: (data: ProcOut<TKey, 'get'>) => TOne;
	/**
	 * Extract a list of items of this resource from the data returned by the "list" procedure.
	 */
	list: (data: ProcOut<TKey, 'list'>) => TOne[];
	/**
	 * Extract the pagination information from the data returned by the "list" procedure.
	 */
	pagination: (data: ProcOut<TKey, 'list'>) => TPagination;
	/**
	 * Extract the title of a single item of this resource from the data returned by the "get" procedure.
	 */
	title: (data: TOne) => string | undefined;
	/**
	 * Extract the description of a single item of this resource from the data returned by the "get" procedure.
	 */
	description: (data: TOne) => string | undefined;
	/**
	 * Extract the app link of a single item of this resource from the data returned by the "get" procedure.
	 */
	appLink: (data: TOne) => string | undefined;
};

export type TDataFnOptions<TKey extends ResourceKey> = {
	one: TDataFn<
		ClientContext,
		ProcIn<TKey, 'get'>,
		ProcOut<TKey, 'get'>,
		DefaultError
	>;
	list: TDataFn<
		ClientContext,
		ProcIn<TKey, 'list'>,
		ProcOut<TKey, 'list'>,
		DefaultError
	>;
	create: TDataFn<
		ClientContext,
		ProcIn<TKey, 'create'>,
		ProcOut<TKey, 'create'>,
		DefaultError
	>;
	update: TDataFn<
		ClientContext,
		ProcIn<TKey, 'update'>,
		ProcOut<TKey, 'update'>,
		DefaultError
	>;
	delete: TDataFn<
		ClientContext,
		ProcIn<TKey, 'delete'>,
		ProcOut<TKey, 'delete'>,
		DefaultError
	>;
};

export type TDataHooks<TKey extends ResourceKey> = {
	/**
	 * Tanstack Query hooks for fetching a single item for this resource.
	 */
	useOne: (
		input: ProcIn<TKey, 'get'>,
	) => UseQueryResult<ProcOut<TKey, 'get'>, DefaultError>;

	/**
	 * Tanstack Query hooks for fetching a list of items for this resource.
	 */
	useList: (
		input: Record<never, never>,
	) => UseQueryResult<ProcOut<TKey, 'list'>, DefaultError>;

	/**
	 * Tanstack Mutation hook for creating a new item for this resource.
	 */
	useCreate: () => UseMutationResult<
		ProcOut<TKey, 'create'>,
		DefaultError,
		ProcIn<TKey, 'create'>
	>;

	/**
	 * Tanstack Mutation hook for updating an item for this resource.
	 */
	useUpdate: () => UseMutationResult<
		ProcOut<TKey, 'update'>,
		DefaultError,
		ProcIn<TKey, 'update'>
	>;

	/**
	 * Tanstack Mutation hook for deleting an item for this resource.
	 */
	useDelete: () => UseMutationResult<
		ProcOut<TKey, 'delete'>,
		DefaultError,
		ProcIn<TKey, 'delete'>
	>;
};

export type DataResource<TKey extends ResourceKey, TOne> = TDataHooks<TKey> & {
	/**
	 * The resource key, e.g. "users", "places", etc.
	 */
	resource: TKey;

	/**
	 * The breadcrumbs for the CRUD pages for this resource.
	 * These are used to display the breadcrumbs on the list, details, new, and edit pages for this resource.
	 */
	breadcrumbs: TDataBreadcrumbs<TOne>;

	/**
	 * The links for the CRUD pages for this resource.
	 * These are used to navigate to the list, details, new, and edit pages for this resource.
	 */
	links: TDataLinks;

	/**
	 * Extract different properties from the resource's data.
	 * These are used to extract the ID, title, description, and app link for a single item of this resource.
	 */
	extractors: TDataExtractors<TKey, TOne>;

	/**
	 * Column definitions for the data table used to display a list of items of this resource.
	 * These are Tanstack Table column definitions.
	 */
	columns: ColumnDef<TOne>[];

	/**
	 * The oRPC procedures for the CRUD operations for this resource.
	 */
	options: TDataFnOptions<TKey>;
};

export class ResourceBuilder<TKey extends ResourceKey, TOne> {
	private readonly _resource: TKey;
	private breadcrumbs: TDataBreadcrumbs<TOne> | null = null;
	private links: TDataLinks | null = null;
	private extractors: TDataExtractors<TKey, TOne> | null = null;
	private columns: ColumnDef<TOne>[] = [];
	private options: TDataFnOptions<TKey> | null = null;
	private hooks: TDataHooks<TKey> | null = null;

	constructor(resource: TKey) {
		this._resource = resource;
	}

	get resource() {
		return this._resource;
	}

	public addBreadcrumbs(breadcrumbs: TDataBreadcrumbs<TOne>) {
		this.breadcrumbs = breadcrumbs;
		return this;
	}

	public addDefaultBreadcrumbs() {
		if (!this.links || !this.extractors) {
			throw new Error(
				'Links and extractors must be defined before adding default breadcrumbs.',
			);
		}

		this.breadcrumbs = getDefaultBreadcrumbs(
			this._resource,
			this.links,
			this.extractors,
		);

		return this;
	}

	public addLinks(links: TDataLinks) {
		this.links = links;
		return this;
	}

	public addDefaultLinks() {
		this.links = getDefaultLinks(this._resource);
		return this;
	}

	public addExtractors(extractors: TDataExtractors<TKey, TOne>) {
		this.extractors = extractors;
		return this;
	}

	public addColumns(columns: ColumnDef<TOne>[]) {
		this.columns = columns;
		return this;
	}

	public addOptions(options: TDataFnOptions<TKey>) {
		this.options = options;
		return this;
	}

	public addHooks(hooks: TDataHooks<TKey>) {
		this.hooks = hooks;
		return this;
	}

	public build(): DataResource<TKey, TOne> {
		if (!this.breadcrumbs) {
			throw new Error(
				'Breadcrumbs must be defined before building the resource.',
			);
		}

		if (!this.links) {
			throw new Error('Links must be defined before building the resource.');
		}

		if (!this.extractors) {
			throw new Error(
				'Extractors must be defined before building the resource.',
			);
		}

		if (!this.options) {
			throw new Error('Options must be defined before building the resource.');
		}

		if (!this.hooks) {
			throw new Error('Hooks must be defined before building the resource.');
		}
		return {
			resource: this._resource,
			breadcrumbs: this.breadcrumbs,
			links: this.links,
			extractors: this.extractors,
			columns: this.columns,
			options: this.options,
			...this.hooks,
		};
	}
}

function getDefaultBreadcrumbs<K extends ResourceKey, TOne>(
	resource: K,
	links: TDataLinks,
	extractors: TDataExtractors<K, TOne>,
): TDataBreadcrumbs<TOne> {
	return {
		list: () => [
			{
				label: toTitleCase(resource),
				link: links.list,
			},
		],
		details: (data: TOne) => [
			{
				label: toTitleCase(resource),
				link: links.list,
			},
			{
				label: extractors.title(data) ?? 'Details',
				link: links.details(extractors.id(data)),
			},
		],
		new: () => [
			{
				label: toTitleCase(resource),
				link: links.list,
			},
			{
				label: 'New',
				link: links.new,
			},
		],
		edit: (data: TOne) => [
			{
				label: toTitleCase(resource),
				link: links.list,
			},
			{
				label: extractors.title(data) ?? 'Details',
				link: links.details(extractors.id(data)),
			},
			{
				label: 'Edit',
				link: links.edit(extractors.id(data)),
			},
		],
	};
}

/**
 * If your resource pages adhere to the standard URL structure, you can use this function to generate the default links
 * for the resource's CRUD pages. This is useful for resources that don't have custom links.
 *
 * Structure:
 *
 * `/dashboard/{resource}` - List page
 *
 * `/dashboard/{resource}/new` - New item page
 *
 * `/dashboard/{resource}/{id}` - Details page
 *
 * `/dashboard/{resource}/{id}/edit` - Edit page
 */
function getDefaultLinks(resource: ResourceKey) {
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
