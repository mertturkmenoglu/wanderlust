export type UpsertProps<T> = {
	action: 'create' | 'edit';
	entity?: T;
};
