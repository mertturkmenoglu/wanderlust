import { useLoaderData } from '@tanstack/react-router';
import { CollapsibleText } from '@/components/collapsible-text';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import { UpsertLocationDialog } from './upsert-location-dialog';

export function Header() {
	const { trip } = useLoaderData({ from: '/trips/$id' });
	const isPrivileged = useTripIsPrivileged();

	return (
		<div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-4">
			<CollapsibleText
				text={
					trip.description.length > 0 ? trip.description : 'No description.'
				}
				charLimit={500}
			/>

			{isPrivileged && <UpsertLocationDialog />}
		</div>
	);
}
