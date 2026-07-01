import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
} from '@wanderlust/ui/components/field';
import { Input } from '@wanderlust/ui/components/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@wanderlust/ui/components/input-group';
import {
	Select,
	SelectTrigger,
	SelectValue,
} from '@wanderlust/ui/components/select';
import { Textarea } from '@wanderlust/ui/components/textarea';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useId, useState } from 'react';
import {
	Controller,
	type FieldValues,
	type UseControllerProps,
} from 'react-hook-form';
import { normalizeMultipleErrors } from '@/lib/form';

// I'm tired of writing the same Shadcn input, field, textarea, select, etc. elements over and over again.
// Instead, I'm going to create a set of base elements here that essentially only need "name" and "control" to work
// but also can take other props to customize the elements.
// And if I need to really customize the elements, I can just use the Shadcn components directly from @wanderlust/ui

type ControlledInputProps<T extends FieldValues = FieldValues> =
	UseControllerProps<T> & ControlledInputElements;

type ControlledInputElements = {
	elements?: Partial<{
		field: React.ComponentProps<typeof Field>;
		label: React.ComponentProps<typeof FieldLabel>;
		input: React.ComponentProps<typeof Input>;
		error: React.ComponentProps<typeof FieldError>;
	}>;
};

export function ControlledInput<T extends FieldValues = FieldValues>({
	elements,
	...controller
}: ControlledInputProps<T>) {
	const id = useId();

	return (
		<Controller
			{...controller}
			render={(r) => (
				<Field data-invalid={r.fieldState.invalid} {...(elements?.field || {})}>
					<FieldLabel
						htmlFor={id}
						className="capitalize"
						{...(elements?.label || {})}
					>
						{elements?.label?.children ?? r.field.name}
					</FieldLabel>

					<Input
						id={id}
						placeholder=""
						autoComplete=""
						aria-invalid={r.fieldState.invalid}
						{...(elements?.input || {})}
						{...r.field}
					/>

					{r.fieldState.invalid && (
						<FieldError
							errors={[r.fieldState.error]}
							{...(elements?.error || {})}
						/>
					)}
				</Field>
			)}
		/>
	);
}

type ControlledPasswordInputProps<T extends FieldValues = FieldValues> =
	UseControllerProps<T> &
		ControlledPasswordInputElements & {
			multipleErrors?: boolean;
		};

type ControlledPasswordInputElements = {
	elements?: Partial<{
		field: React.ComponentProps<typeof Field>;
		label: React.ComponentProps<typeof FieldLabel>;
		inputGroup: React.ComponentProps<typeof InputGroup>;
		input: React.ComponentProps<typeof InputGroupInput>;
		addon: React.ComponentProps<typeof InputGroupAddon>;
		button: React.ComponentProps<typeof InputGroupButton>;
		error: React.ComponentProps<typeof FieldError>;
	}>;
};

export function ControlledPasswordInput<T extends FieldValues = FieldValues>({
	elements,
	multipleErrors = false,
	...controller
}: ControlledPasswordInputProps<T>) {
	const id = useId();
	const [show, setShow] = useState(false);

	return (
		<Controller
			{...controller}
			render={(r) => (
				<Field data-invalid={r.fieldState.invalid} {...(elements?.field || {})}>
					<FieldLabel
						htmlFor={id}
						className="capitalize"
						{...(elements?.label || {})}
					>
						{elements?.label?.children ?? r.field.name}
					</FieldLabel>

					<InputGroup {...(elements?.inputGroup || {})}>
						<InputGroupInput
							id={id}
							aria-invalid={r.fieldState.invalid}
							type={show ? 'text' : 'password'}
							{...r.field}
							{...(elements?.input || {})}
						/>
						<InputGroupAddon align="inline-end" {...(elements?.addon || {})}>
							<InputGroupButton
								type="button"
								variant="ghost"
								size="icon-sm"
								onClick={() => setShow((prev) => !prev)}
								{...(elements?.button || {})}
							>
								{show ? (
									<EyeIcon className="size-4" />
								) : (
									<EyeOffIcon className="size-4" />
								)}
							</InputGroupButton>
						</InputGroupAddon>
					</InputGroup>

					{r.fieldState.invalid && (
						<FieldError
							errors={
								multipleErrors
									? normalizeMultipleErrors(r.fieldState.error?.types)
									: [r.fieldState.error]
							}
							{...(elements?.error || {})}
						/>
					)}
				</Field>
			)}
		/>
	);
}

type ControlledTextareaProps<T extends FieldValues = FieldValues> =
	UseControllerProps<T> & ControlledTextareaElements;

type ControlledTextareaElements = {
	elements?: Partial<{
		field: React.ComponentProps<typeof Field>;
		label: React.ComponentProps<typeof FieldLabel>;
		textarea: React.ComponentProps<typeof Textarea>;
		error: React.ComponentProps<typeof FieldError>;
	}>;
};

export function ControlledTextarea<T extends FieldValues = FieldValues>({
	elements,
	...controller
}: ControlledTextareaProps<T>) {
	const id = useId();

	return (
		<Controller
			{...controller}
			render={(r) => (
				<Field data-invalid={r.fieldState.invalid} {...(elements?.field || {})}>
					<FieldLabel
						htmlFor={id}
						className="capitalize"
						{...(elements?.label || {})}
					>
						{elements?.label?.children ?? r.field.name}
					</FieldLabel>

					<Textarea
						id={id}
						aria-invalid={r.fieldState.invalid}
						{...(elements?.textarea || {})}
						{...r.field}
					/>

					{r.fieldState.invalid && (
						<FieldError
							errors={[r.fieldState.error]}
							{...(elements?.error || {})}
						/>
					)}
				</Field>
			)}
		/>
	);
}

type ControlledSelectProps<T extends FieldValues = FieldValues> =
	UseControllerProps<T> & ControlledSelectElements;

type ControlledSelectElements = {
	label: React.ReactNode;
	description: React.ReactNode;
	selectContent: React.ReactNode;
	elements?: Partial<{
		field: React.ComponentProps<typeof Field>;
		content: React.ComponentProps<typeof FieldContent>;
		description: React.ComponentProps<typeof FieldDescription>;
		label: React.ComponentProps<typeof FieldLabel>;
		select: React.ComponentProps<typeof Select>;
		error: React.ComponentProps<typeof FieldError>;
		trigger: React.ComponentProps<typeof SelectTrigger>;
		value: React.ComponentProps<typeof SelectValue>;
	}>;
};

export function ControlledSelect<T extends FieldValues = FieldValues>({
	elements,
	label,
	description,
	selectContent,
	...controller
}: ControlledSelectProps<T>) {
	const id = useId();

	return (
		<Controller
			{...controller}
			render={(r) => (
				<Field
					data-invalid={r.fieldState.invalid}
					orientation="horizontal"
					{...(elements?.field || {})}
				>
					<FieldContent {...(elements?.content || {})}>
						<FieldLabel
							htmlFor={id}
							className="capitalize"
							{...(elements?.label || {})}
						>
							{label}
						</FieldLabel>

						<FieldDescription {...(elements?.description || {})}>
							{description}

							{r.fieldState.invalid && (
								<FieldError
									errors={[r.fieldState.error]}
									{...(elements?.error || {})}
								/>
							)}
						</FieldDescription>
					</FieldContent>

					<Select
						name={r.field.name}
						value={r.field.value}
						onValueChange={r.field.onChange}
						{...(elements?.select || {})}
					>
						<SelectTrigger
							id={id}
							aria-invalid={r.fieldState.invalid}
							{...(elements?.trigger || {})}
						>
							<SelectValue {...(elements?.value || {})} />
						</SelectTrigger>

						{selectContent}
					</Select>
				</Field>
			)}
		/>
	);
}

// Short for "components". There may be a better name for this but I like the idea of having a short name
// because we are using form elements a lot.
export const cmp = {
	Input: ControlledInput,
	Password: ControlledPasswordInput,
	Textarea: ControlledTextarea,
	Select: ControlledSelect,
};
