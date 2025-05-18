import UserImage from '@/components/blocks/user-image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { userImage } from '@/lib/image';
import { ipx } from '@/lib/ipx';
import { getRouteApi } from '@tanstack/react-router';
import { UsersIcon } from 'lucide-react';

type Props = {
  image: string;
  name: string;
  username: string;
  role: string;
};

function Card({ image, name, username, role }: Props) {
  return (
    <div className="flex items-center gap-4">
      <UserImage
        src={ipx(userImage(image), 'w_512')}
        imgClassName="size-16"
        fallbackClassName="size-16 rounded-md"
        className="size-16 rounded-md"
      />

      <div>
        <div className="text-xl font-bold">{name}</div>
        <div className="text-xs text-primary">@{username}</div>
      </div>

      <div className="ml-auto">
        <Button variant="secondary" size="sm" disabled className="capitalize">
          {role}
        </Button>
      </div>
    </div>
  );
}

export function ParticipantsDialog() {
  const route = getRouteApi('/trips/$id/');
  const { trip } = route.useLoaderData();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="w-full flex justify-start">
          <UsersIcon className="size-4" />
          <span>Participants</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="md:min-w-3xl lg:min-w-4xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <UsersIcon className="size-5 mr-2" />
            <span>Participants</span>
          </AlertDialogTitle>
        </AlertDialogHeader>

        <Separator className="" />

        <div className="space-y-2">
          <Card
            image={trip.owner.profileImage}
            name={trip.owner.fullName}
            role="Owner"
            username={trip.owner.username}
          />

          {trip.participants.map((p) => (
            <Card
              key={p.id}
              image={p.profileImage}
              name={p.fullName}
              role={p.role}
              username={p.username}
            />
          ))}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
