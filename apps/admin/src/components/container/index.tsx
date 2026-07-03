import { Button } from '@wanderlust/ui/components/button';
import { Separator } from '@wanderlust/ui/components/separator';
import { cn } from '@wanderlust/ui/lib/utils';
import { UserIcon } from 'lucide-react';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { Breadcrumbs } from '../breadcrumbs';

type Props = React.ComponentPropsWithoutRef<'div'> & {
	title: string;
	actions?: React.ReactNode;
};

export function Container({
	title,
	className,
	children,
	actions,
	...props
}: Props) {
	const crumbs = useBreadcrumbs();

	return (
		<div className={cn('w-full p-8', className)} {...props}>
			<div className="flex flex-row items-center justify-between">
				<Breadcrumbs crumbs={crumbs} />

				<Button size="icon" variant="ghost">
					<UserIcon />
				</Button>
			</div>

			<div className="mt-4">
				<div className="flex flex-row items-center justify-between gap-4">
					<h1 className="font-medium text-2xl">{title}</h1>
					{actions && <div>{actions}</div>}
				</div>
				<Separator className="mt-2 mb-4" />
				<div>{children}</div>
			</div>
		</div>
	);
}
