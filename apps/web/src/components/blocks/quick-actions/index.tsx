import { BookmarkIcon, ListIcon, MapIcon, MapPinHouseIcon } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '@/providers/auth-provider';
import { Card } from './card';

export function QuickActions() {
	const auth = useContext(AuthContext);

	return (
		<div className="my-8">
			<div className="text-4xl">
				Hello{' '}
				<span className="bg-linear-to-r from-primary to-sky-600 bg-clip-text font-bold text-transparent">
					{auth.user?.fullName ?? ''}
				</span>
			</div>
			<div className="my-2 text-base">How can we help you today?</div>

			<div className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
				<Card to="/trips" Icon={MapIcon} text="Trips" />
				<Card to="/nearby" Icon={MapPinHouseIcon} text="Discover Nearby" />
				<Card to="/bookmarks" Icon={BookmarkIcon} text="Bookmarks" />
				<Card to="/lists" Icon={ListIcon} text="My Lists" />
			</div>
		</div>
	);
}
