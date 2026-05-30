import { Link, type LinkOptions } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import type { MapIcon } from 'lucide-react';

export type QuickActionCardProps = {
	icon: typeof MapIcon;
	text: string;
	link: LinkOptions;
};

export function Card({ icon: Icon, text, link }: QuickActionCardProps) {
	return (
		<div className="group rounded-md bg-yellow-400">
			<Link
				{...link}
				className={cn(
					'flex aspect-[3] flex-col items-center justify-center gap-4 rounded-md bg-slate-50 p-4',
					'transition duration-200 group-hover:translate-x-2 group-hover:-translate-y-2',
				)}
			>
				<Icon className="size-4 md:size-6" />
				<span className="text-sm">{text}</span>
			</Link>
		</div>
	);
}
