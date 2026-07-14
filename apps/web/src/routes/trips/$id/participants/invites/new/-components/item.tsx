import { useLoaderData, useNavigate } from '@tanstack/react-router';
import { Button, buttonVariants } from '@wanderlust/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@wanderlust/ui/components/dialog';
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
	FieldTitle,
} from '@wanderlust/ui/components/field';
import {
	RadioGroup,
	RadioGroupItem,
} from '@wanderlust/ui/components/radio-group';
import { cn } from '@wanderlust/ui/lib/utils';
import { ArrowRightIcon } from 'lucide-react';
import { useState } from 'react';
import { UserImage } from '@/components/user-image';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import type { Outputs } from '@/lib/orpc';
import { useCreateInviteMutation } from './hooks';

type Props = {
	user: Outputs['users']['searchFollowing']['friends'][number];
	className?: string;
};

export function InviteItem({ user, className }: Props) {
	const { trip } = useLoaderData({ from: '/trips/$id' });
	const [role, setRole] = useState('participant');

	const mutation = useCreateInviteMutation();
	const navigate = useNavigate({
		from: '/trips/$id/participants/invites/new/',
	});

	return (
		<Dialog>
			<DialogTrigger
				render={
					<div
						className={cn('flex cursor-pointer items-center gap-4', className)}
					>
						<UserImage src={ipx(userImage(user.image), 'w_512')} />

						<div className="font-medium">{user.name}</div>

						<div className="text-muted-foreground text-sm">
							@{user.username}
						</div>

						<div
							className={buttonVariants({
								variant: 'ghost',
								size: 'sm',
								className: 'ml-auto',
							})}
						>
							<ArrowRightIcon />
						</div>
					</div>
				}
			/>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Invite {user.name} to the trip</DialogTitle>
				</DialogHeader>
				<div>
					<RadioGroup
						defaultValue="participant"
						value={role}
						onValueChange={(v) => setRole(v)}
					>
						<FieldLabel htmlFor="participant">
							<Field orientation="horizontal">
								<FieldContent>
									<FieldTitle>Participant</FieldTitle>
									<FieldDescription>Can view the trip</FieldDescription>
								</FieldContent>
								<RadioGroupItem value="participant" id="participant" />
							</Field>
						</FieldLabel>
						<FieldLabel htmlFor="editor">
							<Field orientation="horizontal">
								<FieldContent>
									<FieldTitle>Editor</FieldTitle>
									<FieldDescription>Can edit the trip</FieldDescription>
								</FieldContent>
								<RadioGroupItem value="editor" id="editor" />
							</Field>
						</FieldLabel>
					</RadioGroup>
				</div>
				<DialogFooter>
					<DialogClose render={<Button variant="secondary">Cancel</Button>} />

					<Button
						onClick={(e) => {
							e.preventDefault();
							mutation.mutate(
								{
									id: trip.id,
									toUserId: user.id,
									role: role === 'participant' ? 'member' : 'editor',
								},
								{
									onSuccess: async () => {
										await navigate({
											to: '/trips/$id/participants/invites',
											params: {
												id: trip.id,
											},
										});
									},
								},
							);
						}}
					>
						Send Invite
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
