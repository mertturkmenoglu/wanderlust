import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { ConciergeBellIcon, Settings2Icon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import { Edit } from './-edit';
import { View } from './-view';

export const Route = createFileRoute('/trips/$id/amenities/')({
	component: RouteComponent,
});

function RouteComponent() {
	const route = getRouteApi('/trips/$id');
	const { trip } = route.useLoaderData();
	const { auth } = route.useRouteContext();
	const isPrivileged = useTripIsPrivileged(trip, auth.user.id);
	const [isEditMode, setIsEditMode] = useState(false);

	return (
		<div className="mt-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<ConciergeBellIcon />
					<span>Requested Amenities</span>
				</div>
				{isPrivileged && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsEditMode((prev) => !prev)}
					>
						{isEditMode ? <XIcon /> : <Settings2Icon />}
						<span className="ml-2">{isEditMode ? 'Editing' : 'Edit'}</span>
					</Button>
				)}
			</div>
			{isEditMode ? <Edit /> : <View />}
		</div>
	);
}
