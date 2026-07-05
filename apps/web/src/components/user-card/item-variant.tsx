import { Link } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import { ArrowRightIcon } from 'lucide-react';
import { UserImage } from '../user-image';
import { useUserCardContext } from './context';
import type { Props } from './types';

export function ItemVariant({
	className,
	variant = 'default',
	...props
}: Props) {
	const ctx = useUserCardContext();

	return (
		<Item variant="outline" size="default" className={cn(className)} {...props}>
			<ItemMedia>
				<UserImage src={ctx.profile.image} />
			</ItemMedia>
			<ItemContent>
				<ItemTitle className="line-clamp-1" title={ctx.profile.name}>
					{ctx.profile.name}
				</ItemTitle>
				<ItemDescription className="line-clamp-1 text-primary text-sm">
					@{ctx.profile.username}
				</ItemDescription>
			</ItemContent>

			<ItemActions>
				<Link
					to="/u/$username"
					params={{
						username: ctx.profile.username,
					}}
					className={buttonVariants({ variant: 'midnight', size: 'sm' })}
				>
					<span>View Profile</span>
					<ArrowRightIcon />
				</Link>
			</ItemActions>
		</Item>
	);
}
