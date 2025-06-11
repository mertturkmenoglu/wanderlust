import { LoaderCircleIcon } from 'lucide-react';

export function Loading() {
  return (
    <div className="w-full my-32 flex items-center justify-center">
      <LoaderCircleIcon className="text-primary size-12 animate-spin" />
    </div>
  );
}
