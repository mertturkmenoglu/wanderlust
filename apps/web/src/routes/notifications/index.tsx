import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { ButtonGroup } from '@wanderlust/ui/components/button-group';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@wanderlust/ui/components/empty';
import { ItemGroup } from '@wanderlust/ui/components/item';
import {
	BellDotIcon,
	CheckCheckIcon,
	GalleryVerticalEndIcon,
	Settings2Icon,
	TrashIcon,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { authGuard } from '@/lib/auth';
import { useNotificationsContext } from '@/stores/notifications-context';
import { NotificationItem } from './-item';

export const Route = createFileRoute('/notifications/')({
	component: RouteComponent,
	beforeLoad: authGuard,
});

function RouteComponent() {
	const { mode, setMode, filtered, markAllAsRead, clearAll } =
		useNotificationsContext();
	const navigate = Route.useNavigate();

	return (
		<div className="mx-auto my-8 max-w-7xl">
			<div className="flex items-center justify-between">
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
				<ButtonGroup>
					<Button
						variant="outline"
						type="button"
						onClick={() => markAllAsRead()}
					>
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
			</div>
			<ItemGroup className="mt-4 gap-2">
				{filtered.map((item) => (
					<NotificationItem key={item.id} item={item} />
				))}
				{filtered.length === 0 && (
					<Empty>
						<EmptyHeader>
							<EmptyMedia>
								<Logo variant="default" grayscale />
							</EmptyMedia>
							<EmptyTitle>
								{mode === 'read'
									? 'You have no read notifications'
									: mode === 'unread'
										? 'You have no unread notifications'
										: 'You have no notifications'}
							</EmptyTitle>
							<EmptyDescription>This place looks empty.</EmptyDescription>
						</EmptyHeader>
						<EmptyContent className="text-muted-foreground">
							Go do some squirrelly things, we are sure you'll get some
							notifications in that time.
						</EmptyContent>
					</Empty>
				)}
			</ItemGroup>
		</div>
	);
}
