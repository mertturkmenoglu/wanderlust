import {
	Item,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { useFormContext } from 'react-hook-form';
import type { Outputs } from '@/lib/orpc';
import { type FormInput, useCitiesQuery } from './-hooks';

type Props = {
	address: Outputs['places']['searchAddresses']['addresses'][number];
};

export function AddressSearchItem({ address }: Props) {
	const form = useFormContext<FormInput>();
	const q = useCitiesQuery();
	const city = q.data.cities.find((c) => c.id === address.cityId);

	return (
		<button
			type="button"
			className="text-left"
			onClick={() => form.setValue('addressId', address.id)}
		>
			<Item
				variant="outline"
				className="col-span-1 hover:cursor-pointer hover:bg-muted"
			>
				<ItemContent>
					<ItemTitle>{address.line1}</ItemTitle>
					<ItemDescription>{address.line2}</ItemDescription>
					<ItemDescription>{address.postalCode}</ItemDescription>
					{city && (
						<ItemDescription>
							{city.name} / {city.countryName}
						</ItemDescription>
					)}
				</ItemContent>
			</Item>
		</button>
	);
}
