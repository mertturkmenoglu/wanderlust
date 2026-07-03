import { Field, FieldError, FieldLabel } from '@wanderlust/ui/components/field';
import { useId } from 'react';
import {
	Controller,
	type ControllerFieldState,
	type ControllerRenderProps,
	type FieldPath,
	type FieldValues,
	type UseControllerProps,
	type UseFormStateReturn,
} from 'react-hook-form';

type ControlledElementProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
	TTransformedValues = TFieldValues,
> = UseControllerProps<TFieldValues, TName, TTransformedValues> & {
	label: string;
	children: (
		r: {
			field: ControllerRenderProps<TFieldValues, TName>;
			fieldState: ControllerFieldState;
			formState: UseFormStateReturn<TFieldValues>;
		},
		id: string,
	) => React.ReactNode;
};

export function ControlledElement<
	T extends FieldValues = FieldValues,
	TName extends FieldPath<T> = FieldPath<T>,
	TTransformedValues = T,
>({
	label,
	children,
	...controller
}: ControlledElementProps<T, TName, TTransformedValues>) {
	const id = useId();

	return (
		<Controller
			{...controller}
			render={(r) => (
				<Field
					data-invalid={r.fieldState.invalid}
					orientation="horizontal"
					className="gap-16"
				>
					<FieldLabel htmlFor={id} className="min-w-64 capitalize">
						{label}
					</FieldLabel>

					<div className="w-full">
						{children(r, id)}

						{r.fieldState.invalid && (
							<FieldError errors={[r.fieldState.error]} />
						)}
					</div>
				</Field>
			)}
		/>
	);
}

export function useFormElement<TFieldValues extends FieldValues = FieldValues>(
	control: UseControllerProps<TFieldValues>['control'],
) {
	return {
		Element: <TName extends FieldPath<TFieldValues>>({
			name,
			label,
			children,
		}: {
			name: TName;
			label: string;
			children: (
				r: {
					field: ControllerRenderProps<TFieldValues, TName>;
					fieldState: ControllerFieldState;
					formState: UseFormStateReturn<TFieldValues>;
				},
				id: string,
			) => React.ReactNode;
		}) => (
			<ControlledElement name={name} control={control} label={label}>
				{children}
			</ControlledElement>
		),
	};
}
