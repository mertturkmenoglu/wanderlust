import { Card } from '@wanderlust/ui/components/card';
import { cn } from '@wanderlust/ui/lib/utils';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { UserImage } from '../user-image';

type Props = {
	className?: string;
	image: string | null;
	fullName: string;
	username: string;
};

export function UserCard({ image, fullName, username, className }: Props) {
	return (
		<Card className={cn('flex items-center gap-4 p-2', className)}>
			<UserImage
				src={ipx(userImage(image), 'w_512')}
				imgClassName="size-16"
				fallbackClassName="size-16 rounded-md"
				className="size-16 rounded-md"
			/>

			<div>
				<div className="line-clamp-1 text-sm capitalize">{fullName}</div>
				<div className="my-1 text-muted-foreground text-xs">@{username}</div>
			</div>
		</Card>
	);
}
