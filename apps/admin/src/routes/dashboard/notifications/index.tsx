import { useDebouncedValue } from '@tanstack/react-pacer';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { Input } from '@wanderlust/ui/components/input';
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { Textarea } from '@wanderlust/ui/components/textarea';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Container } from '@/components/container';
import { authClient } from '@/lib/auth';
import { orpc } from '@/lib/orpc';

type SelectedUser = {
	id: string;
	name: string;
	email: string;
	username?: string;
};

export const Route = createFileRoute('/dashboard/notifications/')({
	component: RouteComponent,
});

function RouteComponent() {
	const [term, setTerm] = useState('');
	const [debounced] = useDebouncedValue(term, { wait: 400 });
	const [selected, setSelected] = useState<SelectedUser | null>(null);
	const [message, setMessage] = useState('');

	const search = useQuery({
		queryKey: ['notify-user-search', debounced],
		queryFn: async () => {
			const result = await authClient.admin.listUsers({
				query: {
					limit: 10,
					offset: 0,
					sortBy: 'name',
					sortDirection: 'asc',
					searchValue: debounced,
					searchField: 'email',
					searchOperator: 'contains',
				},
			});

			if (result.error) {
				throw new Error(result.error.message);
			}

			return result.data.users;
		},
		enabled: debounced.length > 0,
	});

	const sendMutation = useMutation(
		orpc.notifications.send.mutationOptions({
			onSuccess: () => {
				toast.success('Notification sent successfully');
				setSelected(null);
				setMessage('');
				setTerm('');
			},
		}),
	);

	return (
		<Container title="Send Notification">
			<div className="mx-auto max-w-xl">
				{!selected && (
					<>
						<Input
							className="w-full"
							placeholder="Search users by email..."
							value={term}
							onChange={(e) => setTerm(e.target.value)}
						/>

						{search.isLoading && <div className="mt-4">Loading...</div>}
						{search.isError && (
							<div className="mt-4">Error: {search.error.message}</div>
						)}
						{search.data &&
							search.data.length === 0 &&
							debounced.length > 0 && (
								<div className="mt-4">No users found.</div>
							)}
						{search.data && search.data.length > 0 && (
							<ItemGroup className="mt-4 gap-2">
								{search.data.map((user) => (
									<button
										key={user.id}
										type="button"
										className="w-full text-left"
										onClick={() =>
											setSelected({
												id: user.id,
												name: user.name,
												email: user.email,
												// @ts-expect-error username is included in the data
												username: user.username,
											})
										}
									>
										<Item variant="outline" className="hover:bg-muted">
											<ItemContent>
												<ItemTitle>{user.name}</ItemTitle>
												<ItemDescription>{user.email}</ItemDescription>
											</ItemContent>
										</Item>
									</button>
								))}
							</ItemGroup>
						)}
					</>
				)}

				{selected && (
					<div className="flex flex-col gap-4">
						<Item variant="outline">
							<ItemContent>
								<ItemTitle>{selected.name}</ItemTitle>
								<ItemDescription>
									{selected.email}
									{selected.username ? ` · @${selected.username}` : ''}
								</ItemDescription>
							</ItemContent>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setSelected(null)}
							>
								<XIcon />
								Change
							</Button>
						</Item>

						<Textarea
							placeholder="Notification message..."
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							rows={4}
						/>

						<Button
							disabled={message.trim().length === 0 || sendMutation.isPending}
							onClick={() => {
								sendMutation.mutate({
									recipientId: selected.id,
									message: message.trim(),
								});
							}}
						>
							Send Notification
						</Button>
					</div>
				)}
			</div>
		</Container>
	);
}
