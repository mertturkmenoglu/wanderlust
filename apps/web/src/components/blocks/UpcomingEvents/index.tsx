import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { dummydata } from '@/lib/dummydata';

function UpcomingEvents() {
  return (
    <div className="mt-8 grid grid-cols-1 place-content-center gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      {dummydata.map((d) => (
        <Card
          key={d.image}
          className="group"
        >
          <img
            src={d.image}
            alt=""
            className="aspect-video w-full rounded-t-xl object-cover"
            width={512}
            height={288}
          />

          <CardHeader>
            <CardTitle>{d.name}</CardTitle>
            <CardDescription>By {d.organizer}</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{d.location}</p>
              <p className="text-sm text-muted-foreground">{d.startsAt}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UpcomingEvents;
