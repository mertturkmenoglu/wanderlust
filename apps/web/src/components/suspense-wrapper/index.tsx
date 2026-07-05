import { Skeleton } from '@wanderlust/ui/components/skeleton';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { cn } from '@wanderlust/ui/lib/utils';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AppMessage } from '@/components/app-message';

type Props = {
	children: React.ReactNode;
	variant?: 'spinner' | 'skeleton';
	classNames?: Partial<{
		root: string;
		placeholder: string;
	}>;
};

export function SuspenseWrapper({
	children,
	classNames,
	variant = 'spinner',
}: Props) {
	return (
		<ErrorBoundary fallback={<AppMessage error="Something went wrong" />}>
			<Suspense
				fallback={
					<div className={cn('flex justify-center', classNames?.root)}>
						{variant === 'spinner' ? (
							<Spinner
								className={cn('mx-auto my-4 size-12', classNames?.placeholder)}
							/>
						) : (
							<Skeleton
								className={cn(
									'mx-auto my-4 h-full w-full',
									classNames?.placeholder,
								)}
							/>
						)}
					</div>
				}
			>
				{children}
			</Suspense>
		</ErrorBoundary>
	);
}
