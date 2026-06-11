import { Button } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';
import {
	BellDotIcon,
	CheckCheckIcon,
	GalleryVerticalEndIcon,
} from 'lucide-react';
import { useNotificationsContext } from '@/stores/notifications-context';

export function Filters() {
	const { mode, setMode } = useNotificationsContext();

	return (
		<ButtonGroup>
			<Button
				variant={mode === 'all' ? 'default' : 'outline'}
				onClick={() => setMode('all')}
			>
				<GalleryVerticalEndIcon />
				<span>All</span>
			</Button>
			<Button
				variant={mode === 'read' ? 'default' : 'outline'}
				onClick={() => setMode('read')}
			>
				<CheckCheckIcon />
				<span>Read</span>
			</Button>
			<Button
				variant={mode === 'unread' ? 'default' : 'outline'}
				onClick={() => setMode('unread')}
			>
				<BellDotIcon />
				<span>Unread</span>
			</Button>
		</ButtonGroup>
	);
}
