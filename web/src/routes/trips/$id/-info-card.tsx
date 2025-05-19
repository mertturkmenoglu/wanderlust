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
    <div className="border border-border p-4 rounded-md flex flex-col gap-2 aspect-[5/2]">
      <Icon className="size-8 text-primary" />
      <div className="text-lg mt-4">
        {count} {type}
      </div>
    </div>
  );
}
