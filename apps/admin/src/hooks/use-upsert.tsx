import { type MutationOptions, useMutation } from '@tanstack/react-query';
import {
	type DefaultValues,
	type FieldValues,
	type Resolver,
	useForm,
} from 'react-hook-form';

type UseUpsertOptions<
	TEditData,
	TEditError,
	TEditVariables,
	TEditContext,
	TCreateData,
	TCreateError,
	TCreateVariables,
	TCreateContext,
	TFieldValues extends FieldValues,
	R extends Resolver<TFieldValues, unknown, TFieldValues>,
> = {
	resolver: R;
	entity: DefaultValues<TFieldValues> | undefined;
	action: 'create' | 'edit';
	edit: MutationOptions<TEditData, TEditError, TEditVariables, TEditContext>;
	create: MutationOptions<
		TCreateData,
		TCreateError,
		TCreateVariables,
		TCreateContext
	>;
};

export function useUpsert<
	TEditData,
	TEditError,
	TEditVariables,
	TEditContext,
	TCreateData,
	TCreateError,
	TCreateVariables,
	TCreateContext,
	TFieldValues extends FieldValues,
	R extends Resolver<TFieldValues, unknown, TFieldValues>,
>(
	opts: UseUpsertOptions<
		TEditData,
		TEditError,
		TEditVariables,
		TEditContext,
		TCreateData,
		TCreateError,
		TCreateVariables,
		TCreateContext,
		TFieldValues,
		R
	>,
) {
	const form = useForm<TFieldValues>({
		resolver: opts.resolver,
		defaultValues: opts.entity
			? {
					...opts.entity,
				}
			: undefined,
	});

	const edit = useMutation(opts.edit);

	const create = useMutation(opts.create);

	return { form, edit, create, action: opts.action, entity: opts.entity };
}
