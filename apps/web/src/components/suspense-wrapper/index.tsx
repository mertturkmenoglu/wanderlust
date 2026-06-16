import { Skeleton } from '@wanderlust/ui/components/skeleton';
import { Spinner } from '@wanderlust/ui/components/spinner';
import { cn } from '@wanderlust/ui/lib/utils';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AppMessage } from '@/components/app-message';

type Props = {
	children: React.ReactNode;
	placeholderClass?: string;
	placeholderVariant?: 'spinner' | 'skeleton';
};

export function SuspenseWrapper({
	children,
	placeholderClass,
	placeholderVariant = 'spinner',
}: Props) {
	return (
		<ErrorBoundary fallback={<AppMessage error="Something went wrong" />}>
			<Suspense
				fallback={
					<div className="flex justify-center">
						{placeholderVariant === 'spinner' ? (
							<Spinner
								className={cn('mx-auto my-4 size-12', placeholderClass)}
							/>
						) : (
							<Skeleton
								className={cn('mx-auto my-4 h-full w-full', placeholderClass)}
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
