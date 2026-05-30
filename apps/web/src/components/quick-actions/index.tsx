import { linkOptions } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import { BookmarkIcon, ListIcon, MapIcon, MapPinHouseIcon } from 'lucide-react';
import { authClient } from '@/lib/auth';
import { GradientText } from '../gradient-text';
import { Card, type QuickActionCardProps } from './card';

type Props = {
	className?: string;
};

const items: QuickActionCardProps[] = [
	{
		icon: MapIcon,
		text: 'Trips',
		link: linkOptions({
			to: '/trips',
		}),
	},
	{
		icon: MapPinHouseIcon,
		text: 'Discover Nearby',
		link: linkOptions({
			to: '/nearby',
		}),
	},
	{
		icon: BookmarkIcon,
		text: 'Bookmarks',
		link: linkOptions({
			to: '/bookmarks',
		}),
	},
	{
		icon: ListIcon,
		text: 'My Lists',
		link: linkOptions({
			to: '/lists',
		}),
	},
];

export function QuickActions({ className }: Props) {
	const session = authClient.useSession();

	if (!session.data?.user) {
		return null;
	}

	const user = session.data.user;

	return (
		<div className={cn(className)}>
			<div className="text-2xl md:text-4xl">
				Hello <GradientText className="font-bold" text={user.name} />
			</div>
			<div className="text-sm md:mt-2 md:text-base">
				How can we help you today?
			</div>

			<div className="mt-4 grid grid-cols-2 gap-2 md:mt-8 md:grid-cols-4 md:gap-4">
				{items.map((item) => (
					<Card {...item} key={item.text} />
				))}
			</div>
		</div>
	);
}
