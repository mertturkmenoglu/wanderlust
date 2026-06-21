import { useDebouncedValue } from '@tanstack/react-pacer';
import { skipToken, useQuery } from '@tanstack/react-query';
import { buttonVariants } from '@wanderlust/ui/components/button';
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@wanderlust/ui/components/dialog';
import { Input } from '@wanderlust/ui/components/input';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { cn } from '@wanderlust/ui/lib/utils';
import { ArrowRightIcon } from 'lucide-react';
import { useState } from 'react';
import { AppMessage } from '@/components/app-message';
import { UserImage } from '@/components/user-image';
import { userImage } from '@/lib/image';
import { orpc } from '@/lib/orpc';
import { useOpenChatMutation } from './hooks';

export function NewChatDialog() {
	const [searchTerm, setSearchTerm] = useState('');
	const [debounced] = useDebouncedValue(searchTerm, {
		wait: 1000,
	});

	const isQueryEnabled = debounced.length > 1;

	const query = useQuery(
		orpc.users.searchFollowing.queryOptions({
			input: isQueryEnabled ? { username: debounced } : skipToken,
		}),
	);

	const mutation = useOpenChatMutation();

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>New Chat</DialogTitle>
				<DialogDescription>
					Select a friend to start a new chat with.
				</DialogDescription>
				<Input
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Search by username"
					type="search"
				/>
				{!isQueryEnabled && (
					<AppMessage
						empty="Type to see results"
						logoProps={{
							variant: 'medium',
						}}
						classNames={{
							empty: 'text-sm',
						}}
					/>
				)}
				{query.isLoading && <Spinner className={cn('mx-auto my-4 size-12')} />}
				{query.isError && <AppMessage error="Something went wrong" />}
				{query.data && (
					<ItemGroup className="gap-2">
						{query.data.friends.map((friend) => (
							<button
								key={friend.id}
								type="button"
								className="text-left"
								onClick={() => {
									mutation.mutate({
										id: friend.id,
									});
								}}
							>
								<Item variant="outline" className="hover:bg-muted">
									<ItemMedia>
										<UserImage src={userImage(friend.image)} />
									</ItemMedia>
									<ItemContent>
										<ItemTitle>{friend.name}</ItemTitle>
										<ItemDescription>@{friend.username}</ItemDescription>
									</ItemContent>
									<ItemActions>
										<div
											className={buttonVariants({
												variant: 'midnight',
												size: 'icon-sm',
											})}
										>
											<ArrowRightIcon />
										</div>
									</ItemActions>
								</Item>
							</button>
						))}
					</ItemGroup>
				)}
			</DialogHeader>
		</DialogContent>
	);
}
