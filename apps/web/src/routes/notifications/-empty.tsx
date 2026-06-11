import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@wanderlust/ui/components/empty';
import { useMemo } from 'react';
import { Logo } from '@/components/logo';
import { useNotificationsContext } from '@/stores/notifications-context';

export function EmptyState() {
	const { mode } = useNotificationsContext();
	const title = useMemo(() => {
		if (mode === 'read') {
			return 'You have no read notifications';
		}

		if (mode === 'unread') {
			return 'You have no unread notifications';
		}

		return 'You have no notifications';
	}, [mode]);

	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia>
					<Logo variant="default" grayscale />
				</EmptyMedia>
				<EmptyTitle>{title}</EmptyTitle>
				<EmptyDescription>This place looks empty.</EmptyDescription>
			</EmptyHeader>
			<EmptyContent className="text-muted-foreground">
				Go do some squirrelly things, we are sure you'll get some notifications
				in that time.
			</EmptyContent>
		</Empty>
	);
}
