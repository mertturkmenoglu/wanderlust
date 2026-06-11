import { Button } from '@wanderlust/ui/components/button';
import { ItemActions } from '@wanderlust/ui/components/item';
import { CheckCheckIcon } from 'lucide-react';
import {
	type TNotification,
	useNotificationsContext,
} from '@/stores/notifications-context';

type Props = {
	item: TNotification;
};

export function MarkReadView({ item }: Props) {
	const { markAsRead } = useNotificationsContext();

	return (
		<ItemActions>
			<Button
				variant="default"
				size="icon-sm"
				type="button"
				disabled={item.readAt !== null}
				onClick={async (e) => {
					e.preventDefault();
					e.stopPropagation();
					await markAsRead(item.id);
				}}
			>
				<CheckCheckIcon />
				<span className="sr-only">Mark as read</span>
			</Button>
		</ItemActions>
	);
}
