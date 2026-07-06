import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import { ScrollArea } from '@wanderlust/ui/components/scroll-area';
import {
	Sheet,
	SheetContent,
	SheetTrigger,
} from '@wanderlust/ui/components/sheet';
import { Settings2Icon } from 'lucide-react';
import { authGuard } from '@/lib/auth';
import { Sidebar } from './settings/-components/sidebar';

export const Route = createFileRoute('/settings')({
	ssr: false,
	component: RouteComponent,
	beforeLoad: authGuard,
});

function RouteComponent() {
	return (
		<div className="mx-auto mt-8 w-full max-w-7xl">
			<h2 className="text-2xl">Settings</h2>
			<Sheet>
				<SheetTrigger className="md:hidden" asChild>
					<Button variant="secondary" className="mt-4 w-full" size="sm">
						<Settings2Icon />
						<span>Settings</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left">
					<ScrollArea className="mt-16 h-[80vh] pr-4">
						<Sidebar />
					</ScrollArea>
				</SheetContent>
			</Sheet>
			<div className="mt-4 flex flex-col gap-4 md:mt-8 md:flex-row">
				<div className="hidden min-w-xs md:block md:pr-8">
					<Sidebar />
				</div>
				<div className="flex-1 md:-mt-4">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
