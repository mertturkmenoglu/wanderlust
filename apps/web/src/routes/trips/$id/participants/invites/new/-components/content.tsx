import { Input } from '@wanderlust/ui/components/input';
import { AppMessage } from '@/components/app-message';
import { DenseList } from '@/components/dense-list';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { useTripCreateInviteContext } from './context';
import { useSearchFollowingQuery } from './hooks';
import { InviteItem } from './item';

export function Content() {
	const ctx = useTripCreateInviteContext();

	return (
		<div className="mt-4">
			<Input
				placeholder="Search by username"
				className="mt-2 w-full"
				value={ctx.search}
				onChange={(e) => ctx.setSearch(e.target.value)}
			/>
			{!ctx.isQueryEnabled ? (
				<AppMessage empty="Search by username" classNames={{ root: 'mt-8' }} />
			) : (
				<SuspenseWrapper>
					<Results />
				</SuspenseWrapper>
			)}
		</div>
	);
}

function Results() {
	const query = useSearchFollowingQuery();
	const users = query.data.friends ?? [];

	if (users.length === 0) {
		return <AppMessage empty="No users found" classNames={{ root: 'mt-8' }} />;
	}

	return (
		<DenseList
			data={users}
			className="mt-4"
			keyExtractor={(user) => `trip-invite-${user.id}`}
			renderItem={(user, className) => (
				<InviteItem user={user} className={className} />
			)}
		/>
	);
}
