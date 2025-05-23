import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon, XIcon } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { FormInput } from './-schema';

type Props = {
  index: number;
  className?: string;
};

export default function Actions({ index, className }: Props) {
  const form = useFormContext<FormInput>();
  const array = useFieldArray({
    control: form.control,
    name: 'locations',
  });
  const locations = form.watch('locations');
  const location = locations[index];

  if (location === undefined) {
    return <></>;
  }

  return (
    <div className={cn(className)}>
      <Button
        variant="ghost"
        size="icon"
        disabled={index === 0}
        onClick={() => array.swap(index, index - 1)}
      >
        <ArrowUpIcon className="size-3" />
        <span className="sr-only">Move {location.name} up</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        disabled={index === locations.length - 1}
        onClick={() => array.swap(index, index + 1)}
      >
        <ArrowDownIcon className="size-3" />
        <span className="sr-only">Move {location.name} down</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => array.remove(index)}
      >
        <XIcon className="size-3" />
        <span className="sr-only">Remove {location.name}</span>
      </Button>
    </div>
  );
}
