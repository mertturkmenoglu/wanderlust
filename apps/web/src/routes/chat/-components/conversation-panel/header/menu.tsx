import { Button } from '@wanderlust/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@wanderlust/ui/components/dropdown-menu';
import {
	BanIcon,
	BellOffIcon,
	CircleMinusIcon,
	EllipsisVerticalIcon,
	FlagIcon,
	InfoIcon,
	MessageSquareDotIcon,
	SearchIcon,
	Trash2Icon,
} from 'lucide-react';

export function Menu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon-sm">
					<EllipsisVerticalIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-44">
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<InfoIcon />
						<span>Info</span>
					</DropdownMenuItem>

					<DropdownMenuItem>
						<SearchIcon />
						<span>Search</span>
					</DropdownMenuItem>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<BellOffIcon />
							<span>Mute</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuLabel>Mute Chat</DropdownMenuLabel>
								<DropdownMenuItem>
									<span>For 1 hour</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<span>For 8 hours</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<span>For 24 hours</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<span>Until I turn it back on</span>
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>

					<DropdownMenuItem>
						<MessageSquareDotIcon />
						<span>Mark as Unread</span>
					</DropdownMenuItem>

					<DropdownMenuItem>
						<CircleMinusIcon />
						<span>Clear Chat</span>
					</DropdownMenuItem>

					<DropdownMenuItem>
						<Trash2Icon />
						<span>Delete Chat</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem variant="destructive">
						<FlagIcon />
						<span>Report</span>
					</DropdownMenuItem>

					<DropdownMenuItem variant="destructive">
						<BanIcon />
						<span>Block</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
