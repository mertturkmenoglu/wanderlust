import { zodResolver } from '@hookform/resolvers/zod';
import { addresses as dto } from '@wanderlust/contract';
import { Button } from '@wanderlust/ui/components/button';
import {
	FieldDescription,
	FieldGroup,
	FieldLegend,
	FieldSet,
} from '@wanderlust/ui/components/field';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { cmp } from '@/components/form';
import { useUpsert } from '@/hooks/use-upsert';
import type { Outputs } from '@/lib/orpc';
import { addressesResource } from '@/resources/addresses';

type Address = Outputs['addresses']['get']['address'];

export type UpsertProps = {
	action: 'create' | 'edit';
	address?: Address;
};

const schema = dto.updateInput;

export function Upsert({ action, address }: UpsertProps) {
	const ent = () => {
		if (address) {
			const { city, ...rest } = address;
			return rest;
		}
		return undefined;
	};

	const upsert = useUpsert({
		action,
		resolver: zodResolver(schema),
		entity: ent(),
		resource: addressesResource,
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
					{action} address
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
						name="line1"
						control={upsert.form.control}
						elements={{
							field: {
								orientation: 'horizontal',
								className: 'gap-16',
							},
							label: {
								className: 'min-w-64',
								children: 'Line 1',
							},
							input: {
								placeholder: 'Line 1',
								disabled: action === 'edit',
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
