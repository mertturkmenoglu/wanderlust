import { cn } from '@/lib/utils';
import { usePoiCardContext } from './context';

export function DotNavigation() {
  const ctx = usePoiCardContext();
  const count = ctx.poi.images.length;

  return (
    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 opacity-0 group-hover:opacity-80 duration-200">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn('size-2 rounded-full border border-border', {
            'bg-primary': i === ctx.index,
          })}
        />
      ))}
    </div>
  );
}
