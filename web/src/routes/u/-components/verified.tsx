import { cn } from '@/lib/utils';
import { BadgeCheckIcon } from 'lucide-react';

type Props = {
  className?: string;
};

export default function Verified({ className }: Props) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <BadgeCheckIcon className="size-6 text-primary" />
      <span className="text-sm text-gray-500">Verified</span>
    </div>
  );
}
