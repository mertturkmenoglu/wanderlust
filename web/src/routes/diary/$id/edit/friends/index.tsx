import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { FormProvider, useForm } from 'react-hook-form';
import { List } from './-list';
import SearchResults from './-results';
import { schema } from './-schema';
import SearchInput from './-search-input';

export const Route = createFileRoute('/diary/$id/edit/friends/')({
  component: RouteComponent,
});

function RouteComponent() {
  const route = getRouteApi('/diary/$id/edit');
  const { entry } = route.useLoaderData();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      friends: entry.friends.map((f) => ({
        id: f.id,
        username: f.username,
        fullName: f.fullName,
        profileImage: f.profileImage,
      })),
      friendSearch: '',
    },
  });

  return (
    <div className="my-8 max-w-2xl">
      <FormProvider {...form}>
        <h3 className="text-lg">Edit Friends</h3>

        <div className="group mt-2">
          <SearchInput />

          <SearchResults className="hidden group-focus-within:block" />
        </div>

        <List />
      </FormProvider>
    </div>
  );
}
