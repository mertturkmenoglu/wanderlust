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
import { accoladesResource } from '@/resources/accolades';

type Accolade = Outputs['accolades']['get']['accolade'];

export type UpsertProps = {
	action: 'create' | 'edit';
	accolade?: Accolade;
};

const schema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	badge: z.string(),
	image: z.string().url(),
});

export function Upsert({ action, accolade }: UpsertProps) {
	const ent = () => {
		if (accolade) {
			const { createdAt, updatedAt, ...rest } = accolade;
			return rest;
		}
		return undefined;
	};

	const upsert = useUpsert({
		action,
		resolver: zodResolver(schema),
		entity: ent(),
		resource: accoladesResource,
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
					{action} accolade
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
						name="title"
						control={upsert.form.control}
						elements={{
							field: {
								orientation: 'horizontal',
								className: 'gap-16',
							},
							label: {
								className: 'min-w-64',
								children: 'Title',
							},
							input: {
								placeholder: 'Title',
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
