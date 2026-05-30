import { Link, linkOptions } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { serializeParams } from '@/lib/search';

export type Props = {
	text: string;
	icon: LucideIcon;
	category: string;
	cityName?: string;
};

export function NavItem(props: Props): React.ReactElement {
	const { category, cityName } = props;

	const link = linkOptions({
		to: '/search',
		search: {
			category: serializeParams([category]),
			...(cityName ? { city: serializeParams([cityName]) } : {}),
		},
	});

	return (
		<li>
			<Link
				{...link}
				className={cn(
					'flex flex-col items-center p-1',
					'transition-all duration-200',
					'group border-b-2 border-b-transparent hover:border-b-primary',
					'text-muted-foreground',
				)}
			>
				<props.icon className="size-4 group-hover:text-primary md:size-6" />
				<span className="mt-1 line-clamp-1 text-center group-hover:text-primary">
					{props.text}
				</span>
			</Link>
		</li>
	);
}
