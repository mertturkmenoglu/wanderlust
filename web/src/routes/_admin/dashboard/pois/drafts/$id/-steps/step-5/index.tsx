import StepsNavigation from '../steps-navigation';

import { Button } from '@/components/ui/button';
import { ipx } from '@/lib/ipx';
import { getRouteApi } from '@tanstack/react-router';
import { TrashIcon } from 'lucide-react';
import UploadDialog from './upload-dialog';

export default function Step5() {
  const route = getRouteApi('/_admin/dashboard/pois/drafts/$id/');
  const { draft: d } = route.useLoaderData();
  let draft = d as any;

  const media = draft.media ?? [];

  return (
    <div>
      <div className="container mx-0 mt-8 grid grid-cols-1 gap-4 px-0 md:grid-cols-2">
        <div className="col-span-2">
          <h3 className="text-2xl font-bold tracking-tight">Uploaded</h3>
        </div>

        <UploadDialog draft={draft} />

        <div className="col-span-2 space-y-8">
          {media.map(
            (m: {
              url: string;
              alt: string | null;
              caption: string | null;
              order: number;
            }) => (
              <div key={m.url} className="flex gap-4 items-center">
                <Button
                  variant="destructive"
                  type="button"
                  size="icon"
                  onClick={async () => {
                    const name = m.url.split('/').at(-1) ?? '';
                    try {
                      // await deleteDraftMedia(draft.id, name);
                      window.location.reload();
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                >
                  <TrashIcon className="size-4" />
                </Button>
                <img
                  src={ipx(m.url, 'w_512')}
                  alt={m.alt ?? ''}
                  className="w-64 rounded-md object-cover"
                />
                <div className="text-sm text-muted-foreground">
                  <div>URL: {m.url}</div>
                  <div>Caption: {m.caption}</div>
                  <div>Alt: {m.alt}</div>
                  <div>Order: {m.order}</div>
                </div>
              </div>
            ),
          )}
          {media.length === 0 && <div>No media uploaded yet.</div>}
        </div>
        <StepsNavigation draftId={draft.id} step={5} />
      </div>
    </div>
  );
}
