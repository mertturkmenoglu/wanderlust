import { ItemGroup } from '@wanderlust/ui/components/item';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { cn } from '@wanderlust/ui/lib/utils';
import { AppMessage } from '@/components/app-message';
import { useNewChatDialogContext } from './context';
import { useSearchFollowingQuery } from './hooks';
import { ResultItem } from './result-item';

export function Results() {
	const ctx = useNewChatDialogContext();
	const query = useSearchFollowingQuery();

	if (query.isLoading) {
		return <Spinner className={cn('mx-auto my-4 size-12')} />;
	}

	if (query.isError) {
		return (
			<AppMessage
				error="Something went wrong"
				logoProps={{
					variant: 'medium',
				}}
				classNames={{
					error: 'text-sm',
				}}
			/>
		);
	}

	if (!query.data) {
		return (
			<AppMessage
				empty="Type to see results"
				logoProps={{
					variant: 'medium',
				}}
				classNames={{
					empty: 'text-sm',
				}}
			/>
		);
	}

	if (query.data.friends.length === 0) {
		return (
			<AppMessage
				empty="No users found"
				logoProps={{
					variant: 'medium',
				}}
				classNames={{
					empty: 'text-sm',
				}}
			/>
		);
	}

	return (
		<ItemGroup className="gap-2">
			{query.data.friends.map((user) => (
				<button
					key={user.id}
					type="button"
					className="text-left"
					onClick={() => {
						ctx.setSelectedUser(user);
					}}
				>
					<ResultItem user={user} />
				</button>
			))}
		</ItemGroup>
	);
}
