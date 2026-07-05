import { Link } from '@tanstack/react-router';
import { Image } from '@unpic/react';
import { Badge } from '@wanderlust/ui/components/badge';
import { buttonVariants } from '@wanderlust/ui/components/button';
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@wanderlust/ui/components/card';
import { cn } from '@wanderlust/ui/lib/utils';
import { ArrowRightIcon, UsersIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useNumberFormatter } from '@/hooks/use-number-formatter';
import { useNumberIntl } from '@/hooks/use-number-intl';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { useUserCardContext } from './context';
import type { Props } from './types';

export function DefaultVariant({
	className,
	variant = 'default',
	...props
}: Props) {
	const ctx = useUserCardContext();
	const numFmt = useNumberFormatter();

	const followerFmt = useNumberIntl({
		one: 'Follower',
		other: 'Followers',
	});

	const followingFmt = useNumberIntl({
		one: 'Following',
		other: 'Following',
	});

	const actionText = useMemo(() => {
		if (!ctx.meta) {
			return '';
		}

		if (ctx.meta.isSelf) {
			return 'You';
		}

		if (ctx.meta.isFollowing) {
			return 'Following';
		}

		return 'Follow';
	}, [ctx.meta]);

	return (
		<Card
			size="sm"
			className={cn('group @container relative shadow-none', className)}
			{...props}
		>
			<Image
				src={ipx(userImage(props.profile.image), 'w_512')}
				alt={props.profile.name ?? ''}
				layout="constrained"
				aspectRatio={9 / 16}
				height={128}
				className="aspect-4/5 w-full object-cover"
			/>
			<CardHeader className="my-2">
				<CardTitle className="line-clamp-1">{ctx.profile.name}</CardTitle>
				<CardDescription className="text-primary text-xs">
					@{ctx.profile.username}
				</CardDescription>
				{ctx.meta && (
					<CardAction>
						<Badge
							variant={
								ctx.meta.isSelf
									? 'secondary'
									: ctx.meta.isFollowing
										? 'default'
										: 'midnight'
							}
						>
							{actionText}
						</Badge>
					</CardAction>
				)}
			</CardHeader>
			<CardContent className="-my-2 flex flex-row items-center gap-4">
				<div
					className={buttonVariants({
						variant: 'ghost',
						size: 'sm',
						className: 'px-0!',
					})}
					title={followerFmt(ctx.profile.followersCount ?? 0)}
				>
					<UsersIcon />
					{numFmt.format(ctx.profile.followersCount ?? 0)}
				</div>

				<div
					className={buttonVariants({
						variant: 'ghost',
						size: 'sm',
						className: 'px-0!',
					})}
					title={followingFmt(ctx.profile.followingCount ?? 0)}
				>
					<UsersIcon />
					{numFmt.format(ctx.profile.followingCount ?? 0)}
				</div>
			</CardContent>
			<CardFooter>
				<Link
					to="/u/$username"
					params={{ username: ctx.profile.username }}
					className={buttonVariants({
						variant: 'midnight',
						size: 'sm',
						className: 'h-7! w-full justify-center',
					})}
				>
					View Profile
					<ArrowRightIcon />
				</Link>
			</CardFooter>
		</Card>
	);
}
