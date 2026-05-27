import { Link, type LinkOptions } from '@tanstack/react-router';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@wanderlust/ui/components/tooltip';
import type { SearchIcon } from 'lucide-react';

export type IconLinkProps = {
	link: LinkOptions;
	icon: typeof SearchIcon;
	label: string;
};

export function IconLink({ link, icon: Icon, label }: IconLinkProps) {
	return (
		<TooltipProvider delayDuration={300}>
			<Tooltip>
				<TooltipTrigger
					tabIndex={-1}
					className="rounded-full p-2 transition-all duration-500 ease-in-out hover:bg-primary/10 hover:text-primary"
				>
					<Link {...link}>
						<Icon className="size-5" />
						<span className="sr-only">{label}</span>
					</Link>
				</TooltipTrigger>
				<TooltipContent side="bottom" sideOffset={4}>
					<p>{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
