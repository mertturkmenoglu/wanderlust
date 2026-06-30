import { Separator } from '@wanderlust/ui/components/separator';
import { cn } from '@wanderlust/ui/lib/utils';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { Breadcrumbs } from '../breadcrumbs';

type Props = React.ComponentPropsWithoutRef<'div'>;

export function Container({ className, children, ...props }: Props) {
	const crumbs = useBreadcrumbs();

	return (
		<div
			className={cn(
				'mx-auto my-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8',
				className,
			)}
			{...props}
		>
			<Breadcrumbs crumbs={crumbs} />

			<Separator className="my-4" />

			{children}
		</div>
	);
}
