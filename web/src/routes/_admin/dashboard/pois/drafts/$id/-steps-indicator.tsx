import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { getRouteApi, Link } from '@tanstack/react-router';
import { useMemo } from 'react';

const steps = [
  { label: 'Basic Info', value: 1 },
  { label: 'Address', value: 2 },
  { label: 'Amenities', value: 3 },
  { label: 'Open Hours', value: 4 },
  { label: 'Media', value: 5 },
  { label: 'Review', value: 6 },
];

type Props = {
  draftId: string;
};

export default function StepsIndicator({ draftId }: Props) {
  const route = getRouteApi('/_admin/dashboard/pois/drafts/$id/');
  const { step } = route.useSearch();
  const progress = useMemo(() => {
    const w = 100 / steps.length;
    return step * w * 0.95;
  }, [step]);

  return (
    <div className="">
      <Progress value={progress} />
      <div className="flex items-center justify-around mt-4">
        {steps.map((s) => (
          <Link
            key={s.value}
            to="/dashboard/pois/drafts/$id"
            params={{
              id: draftId,
            }}
            search={{
              step: s.value,
            }}
            className={cn('text-sm', {
              'text-primary': s.value === step,
              'text-muted-foreground': s.value !== step,
            })}
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
