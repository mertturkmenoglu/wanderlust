import CollapsibleText from '@/components/blocks/collapsible-text';
import { cn } from '@/lib/utils';
import { getRouteApi } from '@tanstack/react-router';
import { MapIcon } from 'lucide-react';

type Props = {
  className?: string;
};

export function Description({ className }: Props) {
  const route = getRouteApi('/p/$id/');
  const { poi } = route.useLoaderData();

  return (
    <div className={cn(className)}>
      <h3 className="text-xl font-semibold">Description</h3>
      <CollapsibleText
        text={poi.description}
        charLimit={1000}
      />
      <button
        className={cn(
          'bg-primary text-white rounded-md w-full lg:w-1/3 lg:mx-auto',
          'px-8 py-2.5 mt-4 flex items-center gap-2 justify-center hover:opacity-90',
          'transition-all duration-200 ease-in-out',
        )}
      >
        <MapIcon className="size-5" />
        <span className="text-base">Plan a trip</span>
      </button>
    </div>
  );
}
