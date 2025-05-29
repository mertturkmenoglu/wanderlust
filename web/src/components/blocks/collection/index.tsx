import { ipx } from '@/lib/ipx';
import { cn } from '@/lib/utils';
import { HeartIcon } from 'lucide-react';

type Props = {
  className?: string;
  title: string;
  actions?: React.ReactNode;
  items: Array<{
    id: string;
    title: string;
    category: string;
    favorite: boolean;
    image: string;
  }>;
};

export default function Collection({
  className,
  title,
  actions,
  items,
}: Props) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-baseline">
        <h2 className="text-2xl font-bold">{title}</h2>
        {actions && <div>{actions}</div>}
      </div>

      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id}>
            <div className="relative">
              <img
                src={ipx(item.image, 'w_512')}
                alt=""
                className="aspect-video w-full rounded-md object-cover"
              />
              <button className="absolute right-1 top-1 rounded-full bg-white p-1">
                <HeartIcon
                  className={cn('size-4 text-primary', {
                    'fill-primary': item.favorite,
                  })}
                />
              </button>
            </div>
            <div className="mt-2 line-clamp-1 font-semibold">{item.title}</div>
            <div className="text-sm text-muted-foreground">{item.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
