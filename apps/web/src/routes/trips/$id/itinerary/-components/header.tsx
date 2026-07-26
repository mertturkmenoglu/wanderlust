import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import { UpsertLocationDialog } from './upsert-location-dialog';

export function Header() {
	const isPrivileged = useTripIsPrivileged();

	return (
		<div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-4">
			{isPrivileged && <UpsertLocationDialog />}
		</div>
	);
}
