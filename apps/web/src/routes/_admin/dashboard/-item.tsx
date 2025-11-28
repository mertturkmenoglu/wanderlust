import { Link } from '@tanstack/react-router';
import type { ComponentIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type TIcon = typeof ComponentIcon;

type ItemProps = {
	href: string;
	text: string;
	icon: TIcon;
};

export function Item({ href, text, icon: Icon }: ItemProps) {
	return (
		<Link
			to={href}
			className={cn(
				'flex items-center justify-center gap-2 rounded text-muted-foreground',
				'h-16 border border-border hover:border-primary hover:text-primary',
			)}
		>
			<Icon className="size-4" />
			<span className="text-balance text-center">{text}</span>
		</Link>
	);
}
