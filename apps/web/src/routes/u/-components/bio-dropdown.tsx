import { Link } from '@tanstack/react-router';
import { Button } from '@wanderlust/ui/components/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@wanderlust/ui/components/dropdown-menu';
import { EllipsisVerticalIcon, FlagIcon } from 'lucide-react';

type Props = {
	userId: string;
};

export function BioDropdown({ userId }: Props) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="block">
				<Button
					className="flex items-center justify-center"
					variant="outline"
					size="icon"
				>
					<EllipsisVerticalIcon className="size-6 text-black" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-48 space-y-2 p-2" align="end">
				<DropdownMenuItem className="cursor-pointer p-0">
					<Button
						className="flex w-full justify-start hover:no-underline"
						variant="link"
						size="sm"
						asChild
					>
						<Link
							to="/report"
							search={{
								id: userId,
								type: 'user',
							}}
						>
							<FlagIcon className="mr-2 size-4" />
							Report
						</Link>
					</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
