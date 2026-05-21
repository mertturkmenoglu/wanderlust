import { Link, useLoaderData } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Button, buttonVariants } from '@wanderlust/ui/components/button';
import { format, formatDistanceToNow } from 'date-fns';
import { ClipboardCopyIcon } from 'lucide-react';
import { toast } from 'sonner';
import { keyValueCols } from '@/components/dashboard/columns';
import { DataTable } from '@/components/dashboard/data-table';
import { UserImage } from '@/components/user-image';
import { userImage } from '@/lib/image';

const defaultBanner = 'https://i.imgur.com/EwvUEmR.jpg';

export function Table() {
	const query = useLoaderData({ from: '/_admin/dashboard/users/$id/' });

	if (!query.data) {
		return null;
	}

	return (
		<DataTable
			columns={keyValueCols}
			filterColumnId=""
			data={[
				{
					k: 'ID',
					v: (
						<div className="flex items-center gap-2">
							<span>{query.data.id}</span>
							<Button
								variant="link"
								size="sm"
								onClick={() => {
									navigator.clipboard.writeText(query.data.id);
									toast.success('ID copied to clipboard');
								}}
							>
								<ClipboardCopyIcon />
								<span>Copy</span>
							</Button>
						</div>
					),
				},
				{
					k: 'Image',
					v: (
						<UserImage
							src={userImage(query.data.image ?? null)}
							className="size-12"
						/>
					),
				},
				{
					k: 'Name',
					v: query.data.name,
				},
				{
					k: 'Email',
					v: (
						<div className="flex items-center gap-2">
							<span>{query.data.email}</span>
							<Button
								variant="link"
								size="sm"
								onClick={() => {
									navigator.clipboard.writeText(query.data.email);
									toast.success('Email copied to clipboard');
								}}
							>
								<ClipboardCopyIcon />
								<span>Copy</span>
							</Button>
						</div>
					),
				},
				{
					k: 'Username',
					v: (
						<div className="flex items-center gap-2">
							{/* @ts-expect-error Username is valid */}
							<span>@{query.data.username}</span>
							<Link
								to="/u/$username"
								params={{
									// @ts-expect-error Username is valid
									username: query.data.username,
								}}
								className={buttonVariants({ variant: 'link', size: 'sm' })}
							>
								<span>View Profile</span>
							</Link>
						</div>
					),
				},
				{
					k: 'Email Verified',
					v: query.data.emailVerified ? 'Yes' : 'No',
				},
				{
					k: 'Role',
					v: query.data.role === 'admin' ? 'Admin' : 'User',
				},
				{
					k: 'Banned',
					v: query.data.banned ? 'Yes' : 'No',
				},
				{
					k: 'Ban Reason',
					v: query.data.banReason ?? '—',
				},
				{
					k: 'Ban Expires',
					v: query.data.banExpires
						? formatDistanceToNow(query.data.banExpires, { addSuffix: true })
						: '—',
				},
				{
					k: 'Banner',
					v: (
						<Image
							// @ts-expect-error Banner is valid
							src={query.data.banner ?? defaultBanner}
							className="aspect-video w-64 object-contain"
							layout="constrained"
							width={256}
							aspectRatio={16 / 9}
						/>
					),
				},
				{
					k: 'Created At',
					v: format(query.data.createdAt, 'PPP ppp'),
				},
				{
					k: 'Updated At',
					v: format(query.data.updatedAt, 'PPP ppp'),
				},
				{
					k: 'Website',
					// @ts-expect-error Website is valid
					v: query.data.website ? (
						<div className="flex items-center gap-2">
							<a
								// @ts-expect-error Website is valid
								href={query.data.website}
								target="_blank"
								rel="noopener noreferrer"
								className={buttonVariants({
									variant: 'link',
									size: 'sm',
									className: 'px-0!',
								})}
							>
								{/* @ts-expect-error Website is valid */}
								<span>{query.data.website}</span>
							</a>
						</div>
					) : (
						'—'
					),
				},
				{
					k: 'Bio',
					// @ts-expect-error Bio is valid
					v: query.data.bio ?? '—',
				},
				{
					k: 'Followers',
					v: (
						<div className="flex items-center gap-2">
							<Link
								to="/u/$username/followers"
								params={{
									// @ts-expect-error Username is valid
									username: query.data.username,
								}}
								className={buttonVariants({
									variant: 'link',
									size: 'sm',
									className: 'px-0!',
								})}
							>
								{/* @ts-expect-error followersCount is valid */}
								<span>{query.data.followersCount} followers</span>
							</Link>
						</div>
					),
				},
				{
					k: 'Following',
					v: (
						<div className="flex items-center gap-2">
							<Link
								to="/u/$username/following"
								params={{
									// @ts-expect-error Username is valid
									username: query.data.username,
								}}
								className={buttonVariants({
									variant: 'link',
									size: 'sm',
									className: 'px-0!',
								})}
							>
								{/* @ts-expect-error followingCount is valid */}
								<span>{query.data.followingCount} following</span>
							</Link>
						</div>
					),
				},
			]}
		/>
	);
}
