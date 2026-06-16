import { Link, type LinkOptions } from '@tanstack/react-router';
import { DropdownMenuItem } from '@wanderlust/ui/components/dropdown-menu';
import type { UserIcon } from 'lucide-react';

export type MenuItemProps = {
	link: LinkOptions;
	icon: typeof UserIcon;
	text: string;
};

export function MenuItem({ link, icon: Icon, text }: Readonly<MenuItemProps>) {
	return (
		<DropdownMenuItem asChild>
			<Link
				{...link}
				className="cursor-pointer gap-4 focus:bg-primary/10 focus:text-primary focus:[&>svg]:text-primary"
			>
				<Icon />
				<span>{text}</span>
			</Link>
		</DropdownMenuItem>
	);
}
