import AppMessage from '@/components/blocks/app-message';
import Spinner from '@/components/kit/spinner';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { useDebouncedValue } from '@tanstack/react-pacer';
import { getRouteApi } from '@tanstack/react-router';
import { PlusIcon, UsersIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { Item } from './item';
import { VisibilitySection } from './visibility';

export function ParticipantsDialog() {
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
            <TabsTrigger value="invites">Invites</TabsTrigger>
            <TabsTrigger value="visibility">Visibility</TabsTrigger>
          </TabsList>
          <TabsContent value="participants">
            <ParticipantsSection />
          </TabsContent>
          <TabsContent value="invites">
            <InvitesSection />
          </TabsContent>
          <TabsContent value="visibility">
            <VisibilitySection />
          </TabsContent>
        </Tabs>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ParticipantsSection() {
  const route = getRouteApi('/trips/$id/');
  const { trip } = route.useLoaderData();

  return (
    <ScrollArea className="h-[200px]">
      <Item
        image={trip.owner.profileImage}
        name={trip.owner.fullName}
        role="Owner"
        username={trip.owner.username}
      />

      {trip.participants.map((p) => (
        <Item
          key={p.id}
          image={p.profileImage}
          name={p.fullName}
          role={p.role}
          username={p.username}
          className="mt-2"
        />
      ))}
    </ScrollArea>
  );
}

function InvitesSection() {
  const [isSearchMode, setIsSearchMode] = useState(false);

  return (
    <div>
      <Button
        variant="link"
        size="sm"
        className="mx-auto flex items-center gap-2"
        onClick={() => setIsSearchMode(!isSearchMode)}
      >
        {isSearchMode ? (
          <UsersIcon className="size-4" />
        ) : (
          <PlusIcon className="size-4" />
        )}
        <span>{isSearchMode ? 'See invites' : 'Invite users'}</span>
      </Button>
      {isSearchMode ? <ShowSearch /> : <ShowInvites />}
    </div>
  );
}

function ShowInvites() {
  const route = getRouteApi('/trips/$id/');
  const { trip } = route.useLoaderData();

  const invitesQuery = api.useQuery('get', '/api/v2/trips/{tripId}/invites', {
    params: {
      path: {
        tripId: trip.id,
      },
    },
  });

  if (invitesQuery.isPending) {
    return <Spinner className="my-8 mx-auto size-8" />;
  }

  if (invitesQuery.isError) {
    return (
      <AppMessage
        errorMessage="Failed to load invites"
        showBackButton={false}
        className="mt-8"
      />
    );
  }

  const invites = invitesQuery.data.invites;

  if (invites.length === 0) {
    return (
      <AppMessage
        emptyMessage="No invites yet"
        showBackButton={false}
        className="mt-8"
      />
    );
  }

  return (
    <ScrollArea className="h-[200px]">
      {invites?.map((invite) => (
        <Item
          key={invite.id}
          image={invite.to.profileImage}
          name={invite.to.fullName}
          role={invite.role}
          username={invite.to.username}
          className="mt-2"
        />
      ))}
    </ScrollArea>
  );
}

function ShowSearch() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, {
    wait: 500,
  });

  const searchQuery = api.useQuery(
    'get',
    '/api/v2/users/{username}/following/search',
    {
      params: {
        path: {
          username: debouncedSearch,
        },
      },
    },
    {
      enabled: debouncedSearch.length > 1,
    },
  );

  if (searchQuery.isFetching) {
    return <Spinner className="my-8 mx-auto size-8" />;
  }

  if (searchQuery.isError) {
    return (
      <AppMessage
        errorMessage="Failed to search users"
        showBackButton={false}
        className="mt-8"
      />
    );
  }

  const users = searchQuery.data?.friends ?? [];

  return (
    <div>
      <div className="min-h-[200px]">
        <Label className="my-1">Invite a new user to this trip</Label>
        <Input
          placeholder="Search"
          className="mt-2 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {users.length === 0 ? (
          <AppMessage
            emptyMessage={
              search.length > 1 ? 'No users found' : 'Search by username'
            }
            showBackButton={false}
            className="mt-8"
          />
        ) : (
          <ScrollArea className="h-[200px]">
            {users?.map((user) => (
              <Item
                key={user.id}
                image={user.profileImage ?? ''}
                name={user.fullName}
                role={'Invite'}
                username={user.username}
                className="mt-2"
                onClick={(e) => {
                  e.preventDefault();
                  alert('invite');
                }}
              />
            ))}
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
