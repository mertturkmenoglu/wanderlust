import { useNavigate } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';
import { CheckCheckIcon, Settings2Icon, TrashIcon } from 'lucide-react';
import { useNotificationsContext } from '@/stores/notifications-context';

export function Actions() {
	const { markAllAsRead, clearAll } = useNotificationsContext();
	const navigate = useNavigate({ from: '/notifications/' });

	return (
		<ButtonGroup>
			<Button variant="outline" type="button" onClick={() => markAllAsRead()}>
				<CheckCheckIcon />
				<span>Mark All as Read</span>
			</Button>
			<Button variant="outline" type="button" onClick={() => clearAll()}>
				<TrashIcon />
				<span>Clear All</span>
			</Button>
			<Button
				variant="outline"
				type="button"
				onClick={() => navigate({ to: '/settings' })}
			>
				<Settings2Icon />
				<span>Settings</span>
			</Button>
		</ButtonGroup>
	);
}
