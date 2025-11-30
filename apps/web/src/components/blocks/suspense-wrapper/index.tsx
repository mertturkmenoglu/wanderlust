import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AppMessage } from '@/components/blocks/app-message';
import { Spinner } from '@/components/ui/spinner';

type Props = {
	children: React.ReactNode;
};

export function SuspenseWrapper({ children }: Props) {
	return (
		<ErrorBoundary
			fallback={
				<AppMessage
					errorMessage="Something went wrong"
					showBackButton={false}
				/>
			}
		>
			<Suspense
				fallback={
					<div className="flex justify-center">
						<Spinner className="mx-auto my-4 size-12" />
					</div>
				}
			>
				{children}
			</Suspense>
		</ErrorBoundary>
	);
}
