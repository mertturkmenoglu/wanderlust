'use client';

import EmptyContent from '@/components/blocks/EmptyContent';

export default function Error() {
  return (
    <div className="my-64 flex w-full flex-col items-center">
      <EmptyContent errorMessage="Something went wrong" />
    </div>
  );
}
