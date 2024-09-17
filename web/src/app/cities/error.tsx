'use client';

import AppMessage from '@/components/blocks/app-message';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const isNotFound = error.message.includes('404');
  return (
    <div className="my-32">
      {isNotFound ? (
        <AppMessage errorMessage="Not Found" />
      ) : (
        <AppMessage errorMessage={error.message} />
      )}
    </div>
  );
}
