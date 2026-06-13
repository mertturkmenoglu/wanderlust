import { Link, type LinkOptions } from '@tanstack/react-router';
import { buttonVariants } from '@wanderlust/ui/components/button';
import { cn } from '@wanderlust/ui/lib/utils';
import { ArrowLeftIcon } from 'lucide-react';

type Props = {
	className?: string;
	link: LinkOptions;
	text?: string;
};

export function BackLink({ link, className, text = 'Go back' }: Props) {
	return (
		<Link
			{...link}
			className={cn(buttonVariants({ variant: 'link' }), 'px-0!', className)}
		>
			<div className="flex items-center gap-2 px-0">
				<ArrowLeftIcon className="size-4" />
				<div>{text}</div>
			</div>
		</Link>
	);
}
