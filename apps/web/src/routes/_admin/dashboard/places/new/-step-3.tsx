import { useSuspenseQuery } from '@tanstack/react-query';
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
	useComboboxAnchor,
} from '@wanderlust/ui/components/combobox';
import { Field, FieldError, FieldLabel } from '@wanderlust/ui/components/field';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@wanderlust/ui/components/select';
import { Controller, useFormContext } from 'react-hook-form';
import { orpc } from '@/lib/orpc';
import type { FormInput } from './-hooks';

export function Step3() {
	const form = useFormContext<FormInput>();
	const categoriesQuery = useSuspenseQuery(
		orpc.categories.list.queryOptions({
			input: {},
		}),
	);
	const amenitiesQuery = useSuspenseQuery(
		orpc.amenities.list.queryOptions({
			input: {},
		}),
	);

	const anchor = useComboboxAnchor();

	const categories = categoriesQuery.data.categories;
	const amenities = amenitiesQuery.data.amenities;

	return (
		<>
			<Controller
				name="categoryId"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor="categoryId">Category</FieldLabel>
						<Select
							name={field.name}
							value={`${field.value}`}
							defaultValue={`${categories[0]?.id ?? 1}`}
							onValueChange={(v) => field.onChange(+v)}
						>
							<SelectTrigger
								id="categoryId"
								aria-invalid={fieldState.invalid}
								className="min-w-30"
							>
								<SelectValue placeholder="Select" />
							</SelectTrigger>
							<SelectContent position="item-aligned">
								{categories.map((category) => (
									<SelectItem key={category.id} value={`${category.id}`}>
										{category.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Controller
				name="amenities"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor="amenities">Amenities</FieldLabel>
						<Combobox
							multiple
							autoHighlight
							items={amenities}
							defaultValue={field.value}
						>
							<ComboboxChips ref={anchor} className="w-full max-w-xs">
								<ComboboxValue>
									{(values) => (
										<>
											{values.map((v: string) => (
												<ComboboxChip key={v}>{v}</ComboboxChip>
											))}
											<ComboboxChipsInput />
										</>
									)}
								</ComboboxValue>
							</ComboboxChips>
							<ComboboxContent
								anchor={anchor}
								id="amenities"
								aria-invalid={fieldState.invalid}
								className="w-full min-w-30"
							>
								<ComboboxEmpty>No items found.</ComboboxEmpty>
								<ComboboxList className="w-full min-w-30">
									{(item) => (
										<ComboboxItem
											key={item}
											value={item}
											onChange={field.onChange}
											className="capitalize"
										>
											{item}
										</ComboboxItem>
									)}
								</ComboboxList>
							</ComboboxContent>
						</Combobox>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
		</>
	);
}
