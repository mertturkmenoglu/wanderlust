import { api } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import { Header } from './-components/header';
import { format } from 'date-fns';
import { CollapsibleText } from '@/components/blocks/collapsible-text';
import { Separator } from '@/components/ui/separator';
import { Locations } from './-components/locations';
import { Friends } from './-components/friends';
import { Media } from './-components/media';
import { InfoColumn } from './-components/info-column';

export const Route = createFileRoute('/diary/$id/')({
  component: RouteComponent,
  loader: ({ context, params }) => {
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
  const { diary } = Route.useLoaderData();

  return (
    <div className="max-w-7xl mx-auto my-6">
      <Header />

      <div className="grid grid-cols-4 mt-4 gap-8">
        <InfoColumn className="col-span-1 border-r border-border pr-4" />

        <div className="col-span-3 flex flex-col">
          <div className="ml-auto italic text-sm">
            {format(diary.date, 'PPP')}
          </div>

          <CollapsibleText
            text={
              diary.description.length > 0
                ? diary.description
                : 'No description'
            }
            charLimit={1000}
            className="text-justify mt-8"
          />

          {diary.locations.length > 0 && (
            <>
              <Separator className="my-2" />

              <Locations />
            </>
          )}

          {diary.friends.length > 0 && (
            <>
              <Separator className="my-2" />

              <Friends />
            </>
          )}

          {diary.images.length > 0 && (
            <>
              <Separator className="my-2" />

              <Media />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
