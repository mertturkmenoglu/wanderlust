import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTripIsPrivileged } from '@/hooks/use-trip-is-privileged';
import { getRouteApi } from '@tanstack/react-router';
import { UsersIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { InvitesContainer } from './invites';
import { ParticipantsContainer } from './participants';
import { VisibilityContainer } from './visibility';

export function ParticipantsDialog() {
  const route = getRouteApi('/trips/$id/');
  const { trip } = route.useLoaderData();
  const { auth } = route.useRouteContext();
  const isPrivileged = useTripIsPrivileged(trip, auth.user?.id ?? '');
  const isOwner = trip.ownerId === auth.user?.id;

  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="w-full flex justify-start">
          <UsersIcon className="size-4" />
          <span>Participants</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="md:min-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <UsersIcon className="size-5 mr-2" />
            <span>Participants</span>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="ml-auto"
            >
              <XIcon className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          </AlertDialogTitle>
        </AlertDialogHeader>

        <Separator className="" />

        <Tabs defaultValue="participants" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="participants">Participants</TabsTrigger>
            {isPrivileged && <TabsTrigger value="invites">Invites</TabsTrigger>}
            {isOwner && (
              <TabsTrigger value="visibility">Visibility</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="participants">
            <ParticipantsContainer />
          </TabsContent>
          {isPrivileged && (
            <TabsContent value="invites">
              <InvitesContainer />
            </TabsContent>
          )}
          {isOwner && (
            <TabsContent value="visibility">
              <VisibilityContainer />
            </TabsContent>
          )}
        </Tabs>
      </AlertDialogContent>
    </AlertDialog>
  );
}
