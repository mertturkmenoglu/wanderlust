import StepsNavigation from '../steps-navigation';

import { useLoaderData } from '@tanstack/react-router';
import { columns } from './columns';
import { DataTable } from './data-table';

export default function Step5() {
  const { draft: d } = useLoaderData({
    from: '/_admin/dashboard/pois/drafts/$id/',
  });
  let draft = d as any;
  const media = draft.media ?? [];

  return (
    <div>
      <div className="container mx-0 mt-4 grid grid-cols-1 gap-4 px-0 md:grid-cols-2">
        <div className="col-span-2">
          <DataTable columns={columns} data={[...media]} draft={draft} />
        </div>

        <StepsNavigation draftId={draft.id} step={5} />
      </div>
    </div>
  );
}
