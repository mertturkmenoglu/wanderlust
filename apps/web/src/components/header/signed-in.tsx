import { Link, useLocation } from '@tanstack/react-router';
import { CommandDialog } from '@wanderlust/ui/components/command';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@wanderlust/ui/components/tooltip';
import { BellIcon, SearchIcon, SendIcon } from 'lucide-react';
import { useState } from 'react';
import { Search } from '@/components/search';

const hideSearchPaths = new Set(['/', '/search']);

export function SignedInLinks() {
	const [open, setOpen] = useState(false);
	const location = useLocation();
	const showSearch = !hideSearchPaths.has(location.pathname);
	const showIcons = true;

	return (
		<div className="flex items-center gap-2">
			{showSearch && (
				<TooltipProvider delayDuration={300}>
					<Tooltip>
						<TooltipTrigger tabIndex={-1} asChild>
							<button
								type="button"
								className="group inline-flex items-center justify-center rounded-full p-2 transition-all duration-500 ease-in-out hover:bg-primary/10"
								onClick={() => setOpen(true)}
							>
								<SearchIcon className="size-5 transition-all duration-500 ease-in-out group-hover:text-primary" />
								<span className="sr-only">Search</span>
							</button>
						</TooltipTrigger>
						<TooltipContent side="bottom" sideOffset={8}>
							<p>Search</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}

			<CommandDialog open={open} onOpenChange={setOpen}>
				<Search
					className="px-4"
					onItemClicked={() => setOpen(false)}
					showAdvancedSearch={false}
				/>
			</CommandDialog>

			{showIcons && (
				<TooltipProvider delayDuration={300}>
					<Tooltip>
						<TooltipTrigger tabIndex={-1}>
							<Link
								to="/"
								href="/notifications"
								className="group inline-flex items-center justify-center rounded-full p-2 transition-all duration-500 ease-in-out hover:bg-primary/10"
							>
								<BellIcon className="size-5 transition-all duration-500 ease-in-out group-hover:text-primary" />
								<span className="sr-only">Notifications</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent side="bottom" sideOffset={8}>
							<p>Notifications</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}

			{showIcons && (
				<TooltipProvider delayDuration={300}>
					<Tooltip>
						<TooltipTrigger tabIndex={-1}>
							<Link
								to="/"
								href="/messages"
								className="group inline-flex items-center justify-center rounded-full p-2 transition-all duration-500 ease-in-out hover:bg-primary/10"
							>
								<SendIcon className="size-5 transition-all duration-500 ease-in-out group-hover:text-primary" />
								<span className="sr-only">Messages</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent side="bottom" sideOffset={8}>
							<p>Messages</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}
		</div>
	);
}
