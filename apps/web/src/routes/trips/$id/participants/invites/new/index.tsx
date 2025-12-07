import { useDebouncedValue } from '@tanstack/react-pacer';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Input } from '@wanderlust/ui/components/input';
import { Label } from '@wanderlust/ui/components/label';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { useState } from 'react';
import { AppMessage } from '@/components/app-message';
import { orpc } from '@/lib/orpc';
import { Header } from './-header';
import { Item } from './-item';

export const Route = createFileRoute('/trips/$id/participants/invites/new/')({
	component: RouteComponent,
});

function RouteComponent() {
	const [search, setSearch] = useState('');
	const [debouncedSearch] = useDebouncedValue(search, {
		wait: 500,
	});

	const searchQuery = useQuery(
		orpc.users.searchFollowing.queryOptions({
			input: {
				username: debouncedSearch,
			},
			enabled: debouncedSearch.length > 1,
		}),
	);

	if (searchQuery.isFetching) {
		return <Spinner className="mx-auto my-8 size-8" />;
	}

	if (searchQuery.isError) {
		return (
			<AppMessage
				errorMessage="Failed to search users"
				showBackButton={false}
				className="mt-8"
			/>
		);
	}

	const users = searchQuery.data?.friends ?? [];

	return (
		<div>
			<Header />
			<div className="mt-8">
				<Label className="my-1">Invite a new user to this trip</Label>
				<Input
					placeholder="Search"
					className="mt-2 w-full"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				{users.length === 0 ? (
					<AppMessage
						emptyMessage={
							search.length > 1 ? 'No users found' : 'Search by username'
						}
						showBackButton={false}
						className="mt-8"
					/>
				) : (
					<div>
						{users?.map((user) => (
							<Item
								key={user.id}
								image={user.image ?? ''}
								name={user.name}
								username={user.username}
								userId={user.id}
								className="mt-2"
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
