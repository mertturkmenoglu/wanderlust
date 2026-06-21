import { getRouteApi, Link } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@wanderlust/ui/components/dropdown-menu';
import {
	EllipsisVerticalIcon,
	FlagIcon,
	SendIcon,
	Share2Icon,
} from 'lucide-react';
import { toast } from 'sonner';

async function handleShareClick() {
	await navigator.clipboard.writeText(globalThis.window.location.href);
	toast.success('Link copied to clipboard!');
}

export function Menu() {
	const route = getRouteApi('/p/$id/');
	const { place } = route.useLoaderData();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<EllipsisVerticalIcon className="size-6 text-primary" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-48" align="end">
				<DropdownMenuItem asChild>
					<Link to="/chat">
						<SendIcon />
						<span className="ml-2">Send via Chat</span>
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<button onClick={handleShareClick} type="button" className="w-full">
						<Share2Icon />
						<span className="ml-2">Share</span>
					</button>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<Link
						to="/report"
						search={{
							id: place.id,
							type: 'place',
						}}
					>
						<FlagIcon />
						<span className="ml-2">Report</span>
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
