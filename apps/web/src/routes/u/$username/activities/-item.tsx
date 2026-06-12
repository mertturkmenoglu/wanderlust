import { Link } from '@tanstack/react-router';
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { HeartIcon, ListIcon, MapIcon, PenIcon, UserIcon } from 'lucide-react';
import { RelativeTime } from '@/components/relative-time';
import type { Outputs } from '@/lib/orpc';

type Props = {
	item: Outputs['users']['listActivities']['activities'][number];
};

export function ActivityItem({ item }: Props) {
	switch (item.type) {
		case 'create_favorite':
			return <VariantCreateFavorite item={item} />;
		case 'create_list':
			return <VariantCreateList item={item} />;
		case 'create_review':
			return <VariantCreateReview item={item} />;
		case 'create_trip':
			return <VariantCreateTrip item={item} />;
		case 'follow':
			return <VariantFollowUser item={item} />;
		default:
			return null;
	}
}

function VariantCreateFavorite({ item }: Props) {
	const data = item.data as { place: { id: string; name: string } };

	return (
		<Link
			to="/p/$id"
			params={{
				id: data.place.id,
			}}
		>
			<Item variant="outline" className="hover:bg-muted">
				<ItemMedia variant="icon">
					<HeartIcon />
				</ItemMedia>

				<ItemContent>
					<ItemTitle>
						Added <span className="text-primary">{data.place.name}</span> to
						their favorites
					</ItemTitle>
					<ItemDescription>
						<RelativeTime date={new Date(item.createdAt)} />
					</ItemDescription>
				</ItemContent>
			</Item>
		</Link>
	);
}

function VariantCreateList({ item }: Props) {
	const data = item.data as { list: { id: string; name: string } };

	return (
		<Link
			to="/lists/$id"
			params={{
				id: data.list.id,
			}}
		>
			<Item variant="outline" className="hover:bg-muted">
				<ItemMedia variant="icon">
					<ListIcon />
				</ItemMedia>

				<ItemContent>
					<ItemTitle>
						Created a new list{' '}
						<span className="text-primary">{data.list.name}</span>
					</ItemTitle>
					<ItemDescription>
						<RelativeTime date={new Date(item.createdAt)} />
					</ItemDescription>
				</ItemContent>
			</Item>
		</Link>
	);
}

type TCreateReview = {
	review: {
		id: string;
		place: {
			id: string;
			name: string;
		};
	};
};

function VariantCreateReview({ item }: Props) {
	const data = item.data as TCreateReview;

	return (
		<Link
			to="/p/$id/reviews/$reviewId"
			params={{
				id: data.review.place.id,
				reviewId: data.review.id,
			}}
		>
			<Item variant="outline" className="hover:bg-muted">
				<ItemMedia variant="icon">
					<PenIcon />
				</ItemMedia>

				<ItemContent>
					<ItemTitle>
						Wrote a review for{' '}
						<span className="text-primary">{data.review.place.name}</span>
					</ItemTitle>
					<ItemDescription>
						<RelativeTime date={new Date(item.createdAt)} />
					</ItemDescription>
				</ItemContent>
			</Item>
		</Link>
	);
}

function VariantCreateTrip({ item }: Props) {
	const data = item.data as { trip: { id: string; title: string } };

	return (
		<Link
			to="/trips/$id"
			params={{
				id: data.trip.id,
			}}
		>
			<Item variant="outline" className="hover:bg-muted">
				<ItemMedia variant="icon">
					<MapIcon />
				</ItemMedia>

				<ItemContent>
					<ItemTitle>
						Created a new trip{' '}
						<span className="text-primary">{data.trip.title}</span>
					</ItemTitle>
					<ItemDescription>
						<RelativeTime date={new Date(item.createdAt)} />
					</ItemDescription>
				</ItemContent>
			</Item>
		</Link>
	);
}

type TFollowUser = {
	thisUsername: string;
	otherUsername: string;
};

function VariantFollowUser({ item }: Props) {
	const data = item.data as TFollowUser;

	return (
		<Link
			to="/u/$username"
			params={{
				username: data.otherUsername,
			}}
		>
			<Item variant="outline" className="hover:bg-muted">
				<ItemMedia variant="icon">
					<UserIcon />
				</ItemMedia>

				<ItemContent>
					<ItemTitle>
						Started following{' '}
						<span className="text-primary">@{data.otherUsername}</span>
					</ItemTitle>
					<ItemDescription>
						<RelativeTime date={new Date(item.createdAt)} />
					</ItemDescription>
				</ItemContent>
			</Item>
		</Link>
	);
}
