import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@wanderlust/ui/components/button';
import {
	FieldDescription,
	FieldGroup,
	FieldLegend,
	FieldSet,
} from '@wanderlust/ui/components/field';
import { Spinner } from '@wanderlust/ui/components/spinner';
import z from 'zod';
import { cmp } from '@/components/form';
import { useUpsert } from '@/hooks/use-upsert';
import type { Outputs } from '@/lib/orpc';
import { placesResource } from '@/resources/places';

type Place = Outputs['places']['get']['place'];

export type UpsertProps = {
	action: 'create' | 'edit';
	place?: Place;
};

const schema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	phone: z.string().nullable(),
	website: z.string().nullable(),
	addressId: z.number(),
	categoryId: z.number(),
	priceLevel: z.number(),
	accessibilityLevel: z.number(),
	hours: z.record(z.string(), z.string()),
	amenities: z.array(z.string()),
	assets: z
		.object({
			id: z.number(),
			entityType: z.enum(['place', 'review', 'event']),
			entityId: z.string(),
			url: z.string(),
			description: z.string().nullable(),
			order: z.number(),
		})
		.array(),
	accolades: z.string().array(),
});

export function Upsert({ action, place }: UpsertProps) {
	const ent = () => {
		if (place) {
			const { createdAt, updatedAt, ...rest } = place;
			return rest;
		}
		return undefined;
	};

	const upsert = useUpsert({
		action,
		resolver: zodResolver(schema),
		entity: ent(),
		resource: placesResource,
	});

	const onSubmit = upsert.form.handleSubmit(
		(data) => {
			if (action === 'create') {
				upsert.create.mutate(data);
			} else {
				upsert.edit.mutate(data);
			}
		},
		(err) => {
			console.error('Form submission error:', err);
		},
	);

	return (
		<form onSubmit={onSubmit}>
			<FieldSet>
				<FieldLegend className="capitalize">{action}</FieldLegend>
				<FieldDescription className="capitalize">
					{action} place
				</FieldDescription>

				<FieldGroup>
					<cmp.Input
						name="id"
						control={upsert.form.control}
						elements={{
							field: {
								orientation: 'horizontal',
								className: 'gap-16',
							},
							label: {
								className: 'min-w-64',
								children: 'ID',
							},
							input: {
								placeholder: 'ID',
								disabled: action === 'edit',
							},
						}}
					/>

					<cmp.Input
						name="name"
						control={upsert.form.control}
						elements={{
							field: {
								orientation: 'horizontal',
								className: 'gap-16',
							},
							label: {
								className: 'min-w-64',
								children: 'Name',
							},
							input: {
								placeholder: 'Name',
							},
						}}
					/>

					<cmp.Textarea
						name="description"
						control={upsert.form.control}
						elements={{
							field: {
								orientation: 'horizontal',
								className: 'gap-16',
							},
							label: {
								className: 'min-w-64',
								children: 'Description',
							},
							textarea: {
								placeholder: 'Description',
							},
						}}
					/>

					<cmp.Input
						name="badge"
						control={upsert.form.control}
						elements={{
							field: {
								orientation: 'horizontal',
								className: 'gap-16',
							},
							label: {
								className: 'min-w-64',
								children: 'Badge',
							},
							input: {
								placeholder: 'https://example.com/badge.png',
								type: 'url',
							},
						}}
					/>

					<cmp.Input
						name="image"
						control={upsert.form.control}
						elements={{
							field: {
								orientation: 'horizontal',
								className: 'gap-16',
							},
							label: {
								className: 'min-w-64',
								children: 'Image',
							},
							input: {
								placeholder: 'https://example.com/image.png',
								type: 'url',
							},
						}}
					/>

					<Button
						variant="default"
						type="submit"
						className="ml-auto max-w-fit"
						disabled={upsert.create.isPending || upsert.edit.isPending}
					>
						{(upsert.create.isPending || upsert.edit.isPending) && (
							<Spinner className="text-white!" />
						)}
						<span>
							{action === 'create' ? 'Create Accolade' : 'Edit Accolade'}
						</span>
					</Button>
				</FieldGroup>
			</FieldSet>
		</form>
	);
}
