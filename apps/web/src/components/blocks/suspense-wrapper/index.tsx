import { AppMessage } from '@/components/blocks/app-message';
import { Spinner } from '@/components/kit/spinner';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

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
            <Spinner className="size-12 mx-auto my-4" />
          </div>
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
