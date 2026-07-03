import { zodResolver } from '@hookform/resolvers/zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Input } from '@wanderlust/ui/components/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@wanderlust/ui/components/select';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useFormElement } from '@/components/form';
import { FormContainer } from '@/components/form/container';
import { SubmitButton } from '@/components/form/submit-button';
import type { UpsertProps } from '@/components/form/upsert';
import { orpc } from '@/lib/orpc';
import { type Address, addressesResource } from '@/resources/addresses';

const schema = z.object({
	id: z.number({ error: 'Required' }),
	cityId: z.number({ error: 'Required' }),
	lat: z.number({ error: 'Required' }),
	lng: z.number({ error: 'Required' }),
	line1: z.string({ error: 'Required' }),
	line2: z.string().optional(),
	postalCode: z.string().optional(),
});

export function Upsert({ action, entity }: UpsertProps<Address>) {
	const citiesQuery = useSuspenseQuery(
		orpc.cities.list.queryOptions({
			input: {},
		}),
	);

	const allCities = citiesQuery.data.cities;

	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			...(entity ?? {}),
			line2: entity?.line2 ?? undefined,
			postalCode: entity?.postalCode ?? undefined,
		},
	});

	const create = addressesResource.useCreate();

	const edit = addressesResource.useUpdate();

	const onSubmit = form.handleSubmit(
		(data) => {
			const payload = {
				...data,
				line2: data.line2 ?? null,
				postalCode: data.postalCode ?? null,
			};

			if (action === 'create') {
				create.mutate(payload);
			} else {
				edit.mutate(payload);
			}
		},
		(err) => {
			console.error('Form submission error:', err);
		},
	);

	const { Element } = useFormElement(form.control);

	return (
		<form onSubmit={onSubmit}>
			<FormContainer action={action}>
				<Element name="id" label="ID">
					{(r, id) => (
						<Input
							id={id}
							aria-invalid={r.fieldState.invalid}
							placeholder="ID"
							value={r.field.value}
							onChange={(e) => r.field.onChange(Number(e.target.value))}
							disabled={action === 'edit'}
						/>
					)}
				</Element>

				<Element name="line1" label="Line 1">
					{(r, id) => (
						<Input
							id={id}
							aria-invalid={r.fieldState.invalid}
							placeholder="Line 1"
							{...r.field}
						/>
					)}
				</Element>

				<Element name="line2" label="Line 2">
					{(r, id) => (
						<Input
							id={id}
							aria-invalid={r.fieldState.invalid}
							placeholder="Line 2"
							{...r.field}
						/>
					)}
				</Element>

				<Element name="postalCode" label="Postal Code">
					{(r, id) => (
						<Input
							id={id}
							aria-invalid={r.fieldState.invalid}
							placeholder="Postal Code"
							{...r.field}
						/>
					)}
				</Element>

				<Element name="lat" label="Latitude">
					{(r, id) => (
						<Input
							id={id}
							aria-invalid={r.fieldState.invalid}
							placeholder="Latitude"
							value={r.field.value}
							onChange={(e) => r.field.onChange(Number(e.target.value))}
						/>
					)}
				</Element>

				<Element name="lng" label="Longitude">
					{(r, id) => (
						<Input
							id={id}
							aria-invalid={r.fieldState.invalid}
							placeholder="Longitude"
							value={r.field.value}
							onChange={(e) => r.field.onChange(Number(e.target.value))}
						/>
					)}
				</Element>

				<Element name="cityId" label="City">
					{(r, id) => (
						<Select
							name={r.field.name}
							value={r.field.value?.toString()}
							onValueChange={(v) => r.field.onChange(Number(v))}
						>
							<SelectTrigger
								id={id}
								aria-invalid={r.fieldState.invalid}
								className="min-w-32"
							>
								<SelectValue placeholder="City" />
							</SelectTrigger>
							<SelectContent position="popper" align="end">
								{allCities.map((city) => (
									<SelectItem
										key={`select-city-${city.id}`}
										value={city.id.toString()}
									>
										{city.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				</Element>

				<SubmitButton
					action={action}
					isLoading={create.isPending || edit.isPending}
				/>
			</FormContainer>
		</form>
	);
}
