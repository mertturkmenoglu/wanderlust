/** biome-ignore-all lint/suspicious/noExplicitAny: TODO */
import { Link } from '@tanstack/react-router';
import { HeartIcon, PenIcon, UsersIcon } from 'lucide-react';

type UserActivityType =
	| 'activity-favorite'
	| 'activity-follow'
	| 'activity-review';

type Activity = {
	type: UserActivityType;
	payload: Record<string, any>;
};

type Props = {
	activity: Activity;
};

function ActivityCard({ activity: { type, payload } }: Props) {
	if (type === 'activity-favorite') {
		return (
			<div className="flex items-center gap-2">
				<HeartIcon className="size-4 text-primary" />
				<div>
					Added{' '}
					<Link
						to="/p/$id"
						params={{
							id: payload.placeId,
						}}
						className="text-primary"
					>
						{payload.placeName}
					</Link>{' '}
					to favorites.
				</div>
			</div>
		);
	}

	if (type === 'activity-follow') {
		return (
			<div className="flex items-center gap-2">
				<UsersIcon className="size-4 text-primary" />
				<div>
					Followed{' '}
					<Link
						to="/u/$username"
						params={{ username: payload.otherUsername }}
						className="text-primary"
					>
						@{payload.otherUsername}
					</Link>
					.
				</div>
			</div>
		);
	}

	if (type === 'activity-review') {
		return (
			<div className="flex items-center gap-2">
				<PenIcon className="size-4 text-primary" />
				<div>
					Reviewed{' '}
					<Link
						to="/p/$id"
						params={{ id: payload.placeId }}
						className="text-primary"
					>
						{payload.placeName}
					</Link>
					<span className="ml-2">{payload.rating} stars</span>
				</div>
			</div>
		);
	}

	return <div />;
}

export { type Activity, ActivityCard, type UserActivityType };
