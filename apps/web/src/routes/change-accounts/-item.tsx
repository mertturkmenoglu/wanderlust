import { Button } from '@wanderlust/ui/components/button';
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from '@wanderlust/ui/components/item';
import { cn } from '@wanderlust/ui/lib/utils';
import { ChevronRightIcon, LogOutIcon } from 'lucide-react';
import { UserImage } from '@/components/user-image';
import { authClient } from '@/lib/auth';
import { userImage } from '@/lib/image';

type Props = {
	item: {
		session: {
			id: string;
			token: string;
		};
		user: {
			id: string;
			email: string;
			name: string;
			image?: string | null | undefined;
		};
	};
	isCurrentSession: boolean;
};

export function AccountItem({ item, isCurrentSession }: Props) {
	return (
		<Item
			variant="outline"
			className={cn({
				'bg-muted': isCurrentSession,
			})}
		>
			<ItemActions />
			<ItemMedia>
				<UserImage
					src={userImage(item.user.image ?? null)}
					className="size-12"
				/>
			</ItemMedia>
			<ItemContent>
				<ItemTitle>{item.user.name} </ItemTitle>
				<ItemDescription>{item.user.email}</ItemDescription>
			</ItemContent>
			<ItemActions>
				<Button
					variant="ghost"
					size="sm"
					disabled={isCurrentSession}
					onClick={async () => {
						await authClient.multiSession.revoke({
							sessionToken: item.session.token,
						});
						window.location.reload();
					}}
				>
					<LogOutIcon className="text-destructive" />
					<span className="text-destructive">Sign out</span>
				</Button>
				<Button
					variant="outline"
					size="sm"
					className="w-24"
					disabled={isCurrentSession}
					onClick={async () => {
						await authClient.multiSession.setActive({
							sessionToken: item.session.token,
						});
						window.location.reload();
					}}
				>
					{isCurrentSession ? (
						<span>Current</span>
					) : (
						<>
							<span className="">Switch</span>
							<ChevronRightIcon />
						</>
					)}
				</Button>
			</ItemActions>
		</Item>
	);
}
