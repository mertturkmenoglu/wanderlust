import AppMessage from '@/components/blocks/app-message';
import BackLink from '@/components/blocks/back-link';
import { fetchClient } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/lists/$id/items/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const auth = await fetchClient.GET('/api/v2/auth/me');
    const list = await fetchClient.GET('/api/v2/lists/{id}', {
      params: {
        path: {
          id: params.id,
        },
      },
    });

    if (auth.error) {
      throw new Error('Not signed in');
    }

    if (list.error) {
      if (list.error.status === 404) {
        throw new Error('List not found');
      }

      if (list.error.status === 401) {
        throw new Error('You are not signed in');
      }

      if (list.error.status === 403) {
        throw new Error('You do not have permission to update this list');
      }
    }

    return { list: list.data!.list };
  },
  errorComponent: ({ error }) => {
    return (
      <AppMessage
        errorMessage={error.message}
        className="my-32"
        backLink="/lists"
        backLinkText="Go back to the lists page"
      />
    );
  },
});

function RouteComponent() {
  const { list } = Route.useLoaderData();

  return (
    <div className="max-w-7xl mx-auto my-8">
      <BackLink
        href={`/lists/${list.id}`}
        text="Go back to the edit list page"
      />
      <div>
        <div>This is the edit list items page</div>
      </div>
    </div>
  );
}
