import { cn } from '@/lib/utils';
import { CalendarIcon, MapPinnedIcon, UsersIcon } from 'lucide-react';

type Props = {
  type: 'participants' | 'days' | 'locations';
  count: number;
};

const icons: Record<Props['type'], typeof UsersIcon> = {
  participants: UsersIcon,
  days: CalendarIcon,
  locations: MapPinnedIcon,
};

export function InfoCard({ type, count }: Props) {
  const Icon = icons[type];

  return (
    <div
      className={cn('flex flex-col gap-2 sm:aspect-[9/2] rounded-md', {
        'bg-pink-900': type === 'days',
        'bg-emerald-900': type === 'locations',
        'bg-sky-900': type === 'participants',
      })}
    >
      <div
        className={cn('w-min p-2 rounded-md m-4', {
          'bg-pink-50': type === 'days',
          'bg-emerald-50': type === 'locations',
          'bg-sky-50': type === 'participants',
        })}
      >
        <Icon
          className={cn('size-6', {
            'text-pink-400': type === 'days',
            'text-emerald-400': type === 'locations',
            'text-sky-400': type === 'participants',
          })}
        />
      </div>
      <div
        className={cn('mt-auto rounded-b-md px-2 py-1.5', {
          'bg-pink-600': type === 'days',
          'bg-emerald-600': type === 'locations',
          'bg-sky-600': type === 'participants',
        })}
      >
        <div className="text-sm text-white font-bold">
          {count} {type}
        </div>
      </div>
    </div>
  );
}
