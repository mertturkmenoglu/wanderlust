import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { List } from '@/lib/types';
import { cn } from '@/lib/utils';

type Props = {
  list: Omit<List, 'user'>;
};

export default function ListCard({ list }: Props) {
  const firstThreeMedia = list.items
    .slice(0, 3)
    .map((item) => item.location.media[0]);

  const missingCount = 3 - firstThreeMedia.length;
  const missing = new Array(missingCount)
    .fill(0)
    .map((_, i) => i + firstThreeMedia.length);

  return (
    <Card
      key={list.id}
      className={cn('p-4', 'flex flex-col gap-4 lg:flex-row')}
    >
      <div className="grid max-w-fit grid-flow-col grid-rows-4 gap-0.5 self-center lg:self-start">
        {firstThreeMedia.map((media, i) => (
          <img
            key={media.url}
            src={media.url}
            alt={media.alt}
            className={cn('object-cover', {
              'row-span-4 h-full rounded-l-xl': i === 0,
              'row-span-2 aspect-video': i !== 0,
              'rounded-tr-xl': i === 1,
              'rounded-br-xl': i === 2,
            })}
            width={128}
            height={72}
          />
        ))}
        {missing.map((v) => (
          <div
            key={`missing-${v}`}
            className={cn(
              'h-[72px] w-[128px] bg-gradient-to-br from-gray-400 to-gray-200 object-cover',
              {
                'row-span-4 h-full rounded-l-xl': v === 0,
                'row-span-2 aspect-video': v !== 0,
                'rounded-tr-xl': v === 1,
                'rounded-br-xl': v === 2,
              }
            )}
          />
        ))}
      </div>

      <CardHeader className="">
        <CardTitle className="line-clamp-1 text-2xl capitalize">
          {list.name}
        </CardTitle>
        <CardDescription className="line-clamp-1">
          {new Date(list.createdAt).toLocaleDateString()} ({list.items.length}{' '}
          items)
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
