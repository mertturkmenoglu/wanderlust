import { useMutation } from '@tanstack/react-query';
import { useRouteContext } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@wanderlust/ui/components/dropdown-menu';
import { Input } from '@wanderlust/ui/components/input';
import { formatDistanceToNow } from 'date-fns';
import {
	CheckIcon,
	MoreHorizontalIcon,
	PencilIcon,
	Trash2Icon,
	XIcon,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { UserImage } from '@/components/user-image';
import { useInvalidator } from '@/hooks/use-invalidator';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { type Outputs, orpc } from '@/lib/orpc';

type Props = {
	comment: Outputs['trips']['listComments']['comments'][number];
	isPrivileged: boolean;
};

export function Item({ comment, isPrivileged }: Props) {
	const { auth } = useRouteContext({
		from: '/trips/$id/comments/',
	});
	const isOwner = comment.userId === auth.user.id;
	const invalidate = useInvalidator();
	const [isEditMode, setIsEditMode] = useState(false);
	const [content, setContent] = useState(comment.content);

	const deleteCommentMutation = useMutation(
		orpc.trips.deleteComment.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Comment removed');
			},
		}),
	);

	const updateCommentMutation = useMutation(
		orpc.trips.updateComment.mutationOptions({
			onSuccess: async () => {
				await invalidate();
				toast.success('Comment updated');
			},
		}),
	);

	return (
		<div className="border-border not-first:border-t py-4">
			<div className="flex items-start gap-4">
				<UserImage
					src={ipx(userImage(comment.user.image), 'w_512')}
					imgClassName="size-16"
					fallbackClassName="size-16 rounded-md"
					className="size-16 rounded-md"
				/>
				<div className="w-full">
					<div className="font-bold">{comment.user.name}</div>
					<div
						className="text-muted-foreground text-xs"
						title={comment.createdAt.toISOString()}
					>
						{formatDistanceToNow(comment.createdAt)} ago
					</div>

					{isEditMode ? (
						<div className="mt-2 flex w-full items-center gap-2">
							<Input
								type="text"
								autoComplete="off"
								value={content}
								minLength={1}
								maxLength={255}
								onChange={(e) => setContent(e.target.value)}
								className="w-full"
							/>
							<Button
								variant="default"
								size="icon"
								className=""
								onClick={() => {
									updateCommentMutation.mutate({
										id: comment.tripId,
										commentId: comment.id,
										content,
									});
									setIsEditMode(false);
								}}
							>
								<CheckIcon className="size-4" />
								<span className="sr-only">Save</span>
							</Button>

							<Button
								variant="destructive"
								size="icon"
								className=""
								onClick={() => {
									setContent(comment.content);
									setIsEditMode(false);
								}}
							>
								<XIcon className="size-4" />
								<span className="sr-only">Cancel</span>
							</Button>
						</div>
					) : (
						<div className="mt-1">{comment.content}</div>
					)}
				</div>
				<div className="ml-auto">
					{(isOwner || isPrivileged) && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<MoreHorizontalIcon className="size-4" />
									<span className="sr-only">Edit</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{isOwner && (
									<DropdownMenuItem
										variant="default"
										onClick={() => {
											setIsEditMode(true);
										}}
									>
										<PencilIcon className="size-4" />
										<span>Edit Comment</span>
									</DropdownMenuItem>
								)}

								<DropdownMenuItem
									variant="destructive"
									onClick={(e) => {
										e.preventDefault();
										if (
											confirm('Are you sure you want to delete this comment?')
										) {
											deleteCommentMutation.mutate({
												id: comment.tripId,
												commentId: comment.id,
											});
										}
									}}
								>
									<Trash2Icon className="size-4" />
									<span>Delete</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
		</div>
	);
}
