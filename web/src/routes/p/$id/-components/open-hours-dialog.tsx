import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getRouteApi } from '@tanstack/react-router';

function getFormatter(s: string): (x: string) => string {
  if (s.includes(',')) {
    return legacyFormatter;
  }

  return formatter;
}

function formatter(s: string): string {
  return s;
}

function legacyFormatter(s: string): string {
  let a = s.split(', ')[1];
  if (a === undefined) {
    return '';
  }

  let [h, ampm] = a.split(' ');

  if (h === undefined) {
    return '';
  }

  h = h.split(':').splice(0, 2).join(':');
  a = `${h} ${ampm}`;

  return a;
}

function keyToReadableDay(key: string): string {
  switch (key) {
    case 'mon':
      return 'Monday';
    case 'tue':
      return 'Tuesday';
    case 'wed':
      return 'Wednesday';
    case 'thu':
      return 'Thursday';
    case 'fri':
      return 'Friday';
    case 'sat':
      return 'Saturday';
    case 'sun':
      return 'Sunday';
    default:
      return '';
  }
}

export function OpenHoursDialog() {
  const route = getRouteApi('/p/$id/');
  const {
    poi: { hours: data },
  } = route.useLoaderData();
  const allKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const keys = new Set(allKeys.filter((k) => !!data[k]));
  const moo = allKeys.map((key) => {
    if (!keys.has(key)) {
      return {
        readable: keyToReadableDay(key),
        info: 'Closed',
      };
    }

    const o = data[key]?.opensAt ?? '';
    const c = data[key]?.closesAt ?? '';
    const fmt = getFormatter(o);

    return {
      readable: keyToReadableDay(key),
      info: `${fmt(o)} - ${fmt(c)}`,
    };
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="px-0"
        >
          See open hours
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg z-50">
        <DialogHeader>
          <DialogTitle>Open Hours</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-2 text-sm">
          {moo.map(({ readable, info }, i) => (
            <div
              key={i}
              className="grid grid-cols-2"
            >
              <div className="font-semibold">{readable}</div>
              <div className="text-right">{info}</div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
