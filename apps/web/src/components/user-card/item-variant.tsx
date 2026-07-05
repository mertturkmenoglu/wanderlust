import { Image } from '@unpic/react';
import { Badge } from '@wanderlust/ui/components/badge';
import {
	Card,
	CardAction,
	CardHeader,
	CardTitle,
} from '@wanderlust/ui/components/card';
import { cn } from '@wanderlust/ui/lib/utils';
import { useNumberFormatter } from '@/hooks/use-number-formatter';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { useUserCardContext } from './context';
import type { Props } from './types';

export function ItemVariant({
	className,
	variant = 'default',
	...props
}: Props) {
	const ctx = useUserCardContext();
	const numFmt = useNumberFormatter();

	return (
		<Card
			size="sm"
			className={cn('group @container relative', className)}
			{...props}
		>
			<Image
				src={ipx(userImage(props.profile.image), 'w_512')}
				alt={props.profile.name ?? ''}
				layout="constrained"
				aspectRatio={16 / 9}
				height={128}
				className="aspect-video w-full object-cover"
			/>
			<CardHeader>
				<CardTitle className="line-clamp-1">{ctx.profile.name}</CardTitle>
				<CardAction>
					<Badge>@{ctx.profile.username}</Badge>
				</CardAction>
			</CardHeader>
		</Card>
	);
}
