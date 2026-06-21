import { Link, useLoaderData } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@wanderlust/ui/components/dropdown-menu';
import {
	BanIcon,
	EllipsisVerticalIcon,
	FlagIcon,
	MapPlusIcon,
	Share2Icon,
} from 'lucide-react';
import { toast } from 'sonner';

async function handleShareClick() {
	await navigator.clipboard.writeText(globalThis.window.location.href);
	toast.success('Link copied to clipboard!');
}

export function BioDropdown() {
	const { profile, meta } = useLoaderData({ from: '/u/$username' });

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<EllipsisVerticalIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-48" align="end">
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<button type="button" className="w-full" onClick={handleShareClick}>
							<Share2Icon />
							<span className="ml-2">Share</span>
						</button>
					</DropdownMenuItem>

					<DropdownMenuItem asChild>
						<button
							type="button"
							className="w-full disabled:text-muted-foreground"
							onClick={() => {}}
							disabled={meta.isSelf}
						>
							<MapPlusIcon />
							<span className="ml-2">Invite to trip</span>
						</button>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem
						disabled={meta.isSelf}
						variant="destructive"
						asChild
					>
						<Link
							to="/report"
							search={{
								id: profile.id,
								type: 'user',
							}}
						>
							<FlagIcon />
							<span className="ml-2">Report</span>
						</Link>
					</DropdownMenuItem>

					<DropdownMenuItem
						disabled={meta.isSelf}
						variant="destructive"
						asChild
					>
						<button type="button" className="w-full" onClick={() => {}}>
							<BanIcon />
							<span className="ml-2">Block</span>
						</button>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
