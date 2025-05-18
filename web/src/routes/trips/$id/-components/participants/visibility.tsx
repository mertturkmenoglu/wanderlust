import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getRouteApi } from '@tanstack/react-router';
import { GlobeIcon, LockIcon, UsersIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

export function VisibilitySection() {
  const route = getRouteApi('/trips/$id/');
  const { trip } = route.useLoaderData();
  const [value, setValue] = useState(trip.visibilityLevel);
  const isChanged = value !== trip.visibilityLevel;
  const infoText = useMemo(() => {
    if (value === 'public') {
      return 'Anyone can see this trip';
    } else if (value === 'friends') {
      return 'Only participants can see this trip';
    } else {
      return 'Only you can see this trip';
    }
  }, [value]);

  return (
    <div className="h-[200px] flex flex-col justify-center">
      <RadioGroup
        value={value}
        onValueChange={setValue}
        className="grid grid-cols-3 gap-4 items-center"
      >
        <div>
          <RadioGroupItem value="public" id="public" className="peer sr-only" />
          <Label
            htmlFor="public"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <GlobeIcon className="size-4 text-muted-foreground" />
            <span>Public</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem
            value="friends"
            id="friends"
            className="peer sr-only"
          />
          <Label
            htmlFor="friends"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <UsersIcon className="size-4 text-muted-foreground" />
            <span>Participants</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem
            value="private"
            id="private"
            className="peer sr-only"
          />
          <Label
            htmlFor="private"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <LockIcon className="size-4 text-muted-foreground" />
            <span>Private</span>
          </Label>
        </div>
      </RadioGroup>
      <div className="text-sm mt-4 text-muted-foreground">{infoText}</div>

      <Button
        variant="default"
        size="sm"
        className="mt-4 flex w-min mx-auto px-8"
        onClick={() => alert('save')}
        disabled={!isChanged}
      >
        Save
      </Button>
    </div>
  );
}
