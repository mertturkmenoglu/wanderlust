import { cn } from '@/lib/utils';
import { usePoiCardContext } from './context';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

type Props = {
  type: 'previous' | 'next';
};

export function NavigationButton({ type }: Props) {
  const ctx = usePoiCardContext();
  const disabled =
    type === 'previous'
      ? ctx.index === 0
      : ctx.index === ctx.poi.images.length - 1;

  return (
    <button
      type="button"
      className={cn(
        'absolute top-1/2 -translate-y-1/2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-80 duration-200',
        {
          'left-4': type === 'previous',
          'right-4': type === 'next',
        },
      )}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        ctx.setIndex((prev) => {
          return type === 'previous' ? prev - 1 : prev + 1;
        });
      }}
    >
      {type === 'previous' ? (
        <ChevronLeftIcon className="size-4 text-primary" />
      ) : (
        <ChevronRightIcon className="size-4 text-primary" />
      )}
      <span className="sr-only">
        {type === 'previous' ? 'Previous' : 'Next'}
      </span>
    </button>
  );
}
