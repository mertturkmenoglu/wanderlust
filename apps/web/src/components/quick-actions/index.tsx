import { BookmarkIcon, ListIcon, MapIcon, MapPinHouseIcon } from 'lucide-react';
import { authClient } from '@/lib/auth';
import { Card } from './card';

export function QuickActions() {
	const session = authClient.useSession();

	if (!session.data?.user) {
		return null;
	}

	const user = session.data.user;

	return (
		<div className="mt-4 md:mt-8">
			<div className="text-2xl md:text-4xl">
				Hello{' '}
				<span className="bg-linear-to-r from-primary to-sky-600 bg-clip-text font-bold text-transparent">
					{user.name ?? ''}
				</span>
			</div>
			<div className="text-sm md:mt-2 md:text-base">
				How can we help you today?
			</div>

			<div className="mt-4 grid grid-cols-2 gap-2 md:mt-8 md:grid-cols-4 md:gap-4">
				<Card to="/trips" Icon={MapIcon} text="Trips" />
				<Card to="/nearby" Icon={MapPinHouseIcon} text="Discover Nearby" />
				<Card to="/bookmarks" Icon={BookmarkIcon} text="Bookmarks" />
				<Card to="/lists" Icon={ListIcon} text="My Lists" />
			</div>
		</div>
	);
}
