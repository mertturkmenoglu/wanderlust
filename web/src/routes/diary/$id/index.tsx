import CollapsibleText from '@/components/blocks/collapsible-text';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import Friends from './-components/friends';
import Header from './-components/header';
import Locations from './-components/locations';
import Media from './-components/media';

export const Route = createFileRoute('/diary/$id/')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      api.queryOptions('get', '/api/v2/diary/{id}', {
        params: {
          path: {
            id: params.id,
          },
        },
      }),
    );
  },
});

function RouteComponent() {
  const { entry } = Route.useLoaderData();

  return (
    <div className="max-w-7xl mx-auto my-8">
      <Header />

      <Separator className="my-2" />

      <div className="mx-auto">
        <div className="text-lg my-8 ml-auto text-end">
          {new Date(entry.date).toLocaleDateString('en-US', {
            dateStyle: 'full',
          })}
        </div>

        <CollapsibleText
          text={entry.description}
          charLimit={1000}
          className="mt-4 text-justify"
        />

        <Separator className="my-8" />

        <Locations />

        <Separator className="my-8" />

        <Friends />

        <Separator className="my-8" />

        <Media />
      </div>
    </div>
  );
}
