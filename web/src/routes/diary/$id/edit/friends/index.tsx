import { Button } from '@/components/ui/button';
import { useInvalidator } from '@/hooks/use-invalidator';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
  const invalidator = useInvalidator();

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

  const updateFriendsMutation = api.useMutation(
    'patch',
    '/api/v2/diary/{id}/friends',
    {
      onSuccess: async () => {
        await invalidator.invalidate();
        toast.success('Friends updated successfully.');
      },
    },
  );

  return (
    <div className="my-8 max-w-2xl">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            updateFriendsMutation.mutate({
              params: {
                path: {
                  id: entry.id,
                },
              },
              body: {
                friends: data.friends.map((f) => f.id),
              },
            });
          })}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg">Edit Friends</h3>
            <Button
              variant="default"
              size="sm"
              disabled={!form.formState.isDirty}
            >
              Update
            </Button>
          </div>

          <div className="group mt-2">
            <SearchInput />

            <SearchResults className="hidden group-focus-within:block" />
          </div>

          <List />
        </form>
      </FormProvider>
    </div>
  );
}
