import { useMutation } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { PlusIcon, SendHorizonalIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { UserImage } from '@/components/blocks/user-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useInvalidator } from '@/hooks/use-invalidator';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { orpc } from '@/lib/orpc';
import { cn } from '@/lib/utils';

type Props = {
	image: string;
	name: string;
	username: string;
	userId: string;
	className?: string;
};

export function Item({ image, name, username, className, userId }: Props) {
	const route = getRouteApi('/trips/$id');
	const { trip } = route.useLoaderData();
	const [role, setRole] = useState('participant');
	const invalidate = useInvalidator();

	const inviteMutation = useMutation(
		orpc.trips.createInvite.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Invite sent successfully');
			},
		}),
	);

	return (
		<Collapsible className={cn('rounded p-2 focus:outline-primary', className)}>
			<div className="flex items-center gap-4">
				<UserImage
					src={ipx(userImage(image), 'w_512')}
					imgClassName="size-16"
					fallbackClassName="size-16 rounded-md"
					className="size-16 rounded-md"
				/>

				<div>
					<div className="font-bold text-xl">{name}</div>
					<div className="text-primary text-xs">@{username}</div>
				</div>

				<CollapsibleTrigger className="ml-auto">
					<Badge variant="default">
						<PlusIcon className="size-4" />
						<span>Invite</span>
					</Badge>
				</CollapsibleTrigger>
			</div>

			<CollapsibleContent>
				<div className="mt-4">
					<RadioGroup value={role} onValueChange={setRole}>
						<div>Select a Role:</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="participant" id="option-participant" />
							<Label htmlFor="option-participant">Participant</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="editor" id="option-editor" />
							<Label htmlFor="option-editor">Editor</Label>
						</div>
					</RadioGroup>

					<Button
						variant="secondary"
						size="sm"
						className="mt-4"
						onClick={(e) => {
							e.preventDefault();
							inviteMutation.mutate({
								id: trip.id,
								role: role === 'editor' ? 'editor' : 'member',
								toUserId: userId,
							});
						}}
					>
						<SendHorizonalIcon className="size-4" />
						<span>Send Invite</span>
					</Button>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
