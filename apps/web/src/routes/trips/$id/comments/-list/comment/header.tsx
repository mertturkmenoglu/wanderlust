import { Link } from '@tanstack/react-router';
import { ItemHeader } from '@wanderlust/ui/components/item';
import { formatDistanceToNow } from 'date-fns';
import { UserImage } from '@/components/user-image';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { Actions } from './actions';
import { useCommentContext } from './context';

export function Header() {
	const ctx = useCommentContext();

	return (
		<ItemHeader>
			<Link
				to="/u/$username"
				params={{
					username: ctx.comment.user.username,
				}}
				className="flex items-center gap-4"
			>
				<UserImage src={ipx(userImage(ctx.comment.user.image), 'w_512')} />

				<div>
					<div className="font-medium">{ctx.comment.user.name}</div>
					<div className="text-primary text-xs tracking-tight">
						<span>@{ctx.comment.user.username}</span>
					</div>
					<div className="mt-1 text-muted-foreground text-xs">
						{formatDistanceToNow(ctx.comment.createdAt, { addSuffix: true })}
					</div>
				</div>
			</Link>

			<Actions />
		</ItemHeader>
	);
}
