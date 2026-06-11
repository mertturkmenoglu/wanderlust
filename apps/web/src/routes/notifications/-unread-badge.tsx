import { Badge } from '@wanderlust/ui/components/badge';
import { ItemActions } from '@wanderlust/ui/components/item';
import type { TNotification } from '@/stores/notifications-context';

type Props = {
	item: TNotification;
};

export function UnreadBadge({ item }: Props) {
	if (item.readAt !== null) {
		return <ItemActions />;
	}

	return (
		<ItemActions>
			<Badge variant="default">New</Badge>
		</ItemActions>
	);
}
