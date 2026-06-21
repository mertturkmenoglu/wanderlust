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
import { UserImage } from '@/components/user-image';
import { userImage } from '@/lib/image';
import type { NewChatDialogUser } from './context';

type Props = {
	user: NewChatDialogUser;
	isSelected?: boolean;
};

export function ResultItem({ user, isSelected = false }: Props) {
	return (
		<Item
			variant="outline"
			className={cn({
				'hover:bg-muted': !isSelected,
			})}
		>
			<ItemMedia>
				<UserImage src={userImage(user.image)} />
			</ItemMedia>
			<ItemContent>
				<ItemTitle>{user.name}</ItemTitle>
				<ItemDescription>@{user.username}</ItemDescription>
			</ItemContent>
			{!isSelected && (
				<ItemActions>
					<div
						className={buttonVariants({
							variant: 'midnight',
							size: 'icon-sm',
						})}
					>
						<ArrowRightIcon />
					</div>
				</ItemActions>
			)}
		</Item>
	);
}
