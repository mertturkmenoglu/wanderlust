import { useEffect } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { upsertEmitter } from '@/lib/events';

export function useUpsertDirtyEventListener<
	TFieldValues extends FieldValues = FieldValues,
	TContext = unknown,
	TTransformedValues = TFieldValues,
>(form: UseFormReturn<TFieldValues, TContext, TTransformedValues>) {
	useEffect(() => {
		const unsubscribe = form.subscribe({
			formState: {
				isDirty: true,
			},
			callback: ({ isDirty }) => {
				upsertEmitter.emit('isDirty', isDirty ?? false);
			},
		});

		return () => {
			unsubscribe();
		};
	}, [form.subscribe]);
}
