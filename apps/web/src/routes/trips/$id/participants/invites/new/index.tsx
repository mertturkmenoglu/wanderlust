import { AppMessage } from '@/components/blocks/app-message';
import { Spinner } from '@/components/kit/spinner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { useDebouncedValue } from '@tanstack/react-pacer';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Header } from './-header';
import { Item } from './-item';

export const Route = createFileRoute('/trips/$id/participants/invites/new/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, {
    wait: 500,
  });

  const searchQuery = api.useQuery(
    'get',
    '/api/v2/users/search/following',
    {
      params: {
        query: {
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
      <Header />
      <div className="mt-8">
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
          <div>
            {users?.map((user) => (
              <Item
                key={user.id}
                image={user.profileImage ?? ''}
                name={user.fullName}
                username={user.username}
                userId={user.id}
                className="mt-2"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
