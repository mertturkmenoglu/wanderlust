import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { MapIcon } from 'lucide-react';

type Props = {
  to: string;
  Icon: typeof MapIcon;
  text: string;
};

export function Card({ to, Icon, text }: Props) {
  return (
    <div className="bg-yellow-400 rounded-md group">
      <Link
        to={to}
        className={cn(
          'bg-slate-50 p-4 rounded-md flex flex-col items-center justify-center gap-4 aspect-[3]',
          'transition duration-200 group-hover:-translate-y-2 group-hover:translate-x-2',
        )}
      >
        <Icon className="size-6" />
        <span className="text-sm">{text}</span>
      </Link>
    </div>
  );
}
