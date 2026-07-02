import {
	type DefaultValues,
	type FieldValues,
	type Resolver,
	useForm,
} from 'react-hook-form';
import type { DataResource, ResourceKey } from '@/lib/crud';

export type UseUpsertOptions<
	K extends ResourceKey,
	T,
	TFieldValues extends FieldValues,
	R extends Resolver<TFieldValues, unknown, TFieldValues>,
> = {
	resolver: R;
	entity: DefaultValues<TFieldValues> | undefined;
	resource: DataResource<K, T>;
	action: 'create' | 'edit';
};

export function useUpsert<
	K extends ResourceKey,
	T,
	TFieldValues extends FieldValues,
	R extends Resolver<TFieldValues, unknown, TFieldValues>,
>(opts: UseUpsertOptions<K, T, TFieldValues, R>) {
	const form = useForm<TFieldValues>({
		resolver: opts.resolver,
		defaultValues: opts.entity
			? {
					...opts.entity,
				}
			: undefined,
	});

	const edit = opts.resource.useUpdate();

	const create = opts.resource.useCreate();

	return {
		form,
		edit,
		create,
	};
}
