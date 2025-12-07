import { Link } from '@tanstack/react-router';
import { cn } from '@wanderlust/ui/lib/utils';
import type { MapIcon } from 'lucide-react';

type Props = {
	to: string;
	Icon: typeof MapIcon;
	text: string;
};

export function Card({ to, Icon, text }: Props) {
	return (
		<div className="group rounded-md bg-yellow-400">
			<Link
				to={to}
				className={cn(
					'flex aspect-[3] flex-col items-center justify-center gap-4 rounded-md bg-slate-50 p-4',
					'group-hover:-translate-y-2 transition duration-200 group-hover:translate-x-2',
				)}
			>
				<Icon className="size-6" />
				<span className="text-sm">{text}</span>
			</Link>
		</div>
	);
}
