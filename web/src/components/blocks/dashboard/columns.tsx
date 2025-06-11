import { Link } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';

type KeyValueCols = {
  k: string;
  v: string;
};

const keyValueCols: ColumnDef<KeyValueCols>[] = [
  {
    accessorKey: 'k',
    header: 'Key',
  },
  {
    accessorKey: 'v',
    header: 'Value',
  },
];

type Poi = {
  id: string;
  name: string;
  addressId: number;
  categoryId: number;
};

const poisCols: ColumnDef<Poi>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'addressId',
    header: 'Address ID',
  },
  {
    accessorKey: 'categoryId',
    header: 'Category ID',
  },
];

type Report = {
  id: string;
  resourceId: string;
  resourceType: string;
  reporterId: string | null;
  description: string | null;
  reason: string;
  resolved: string;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const reportsCols: ColumnDef<Report>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'resourceId',
    header: 'Resource ID',
  },
  {
    accessorKey: 'resourceType',
    header: 'Resource Type',
  },
  {
    accessorKey: 'reporterId',
    header: 'Reporter ID',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
  },
  {
    accessorKey: 'resolved',
    header: 'Resolved',
  },
  {
    accessorKey: 'resolvedAt',
    header: 'Resolved At',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
  },
];

type PoiDraft = {
  id: string;
  name: string;
  v: number;
};

const poisDraftsCols: ColumnDef<PoiDraft>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'v',
    header: 'Version',
  },
];

type City = {
  id: number;
  name: string;
  stateName: string;
  stateCode: string;
  countryName: string;
  countryCode: string;
};

const citiesCols: ColumnDef<City>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'stateName',
    header: 'State',
  },
  {
    accessorKey: 'stateCode',
    header: 'State Code',
  },
  {
    accessorKey: 'countryName',
    header: 'Country',
  },
  {
    accessorKey: 'countryCode',
    header: 'Country Code',
  },
];

type Export = {
  id: string;
  createdAt: string;
  status: string;
  progress: string;
  error: string | null;
  file: string | null;
  itemCount: number;
};

const exportsCols: ColumnDef<Export>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return (
        <Link
          to="/dashboard/exports/$id"
          params={{
            id: row.getValue('id') ?? '',
          }}
          className="text-primary hover:underline"
        >
          {row.getValue('id')}
        </Link>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue('createdAt')}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'progress',
    header: 'Progress',
  },
  {
    accessorKey: 'error',
    header: 'Error',
  },
  {
    accessorKey: 'file',
    header: 'File',
    cell: ({ row }) => {
      return (
        <a
          href={row.getValue('file')}
          className="text-primary hover:underline"
        >
          Download {row.getValue('')}
        </a>
      );
    },
  },
  {
    accessorKey: 'itemCount',
    header: '# Items',
  },
];

type Collection = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

const collectionsCols: ColumnDef<Collection>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
];

export {
  citiesCols,
  collectionsCols,
  exportsCols,
  keyValueCols,
  poisCols,
  poisDraftsCols,
  reportsCols,
  type City,
  type Collection,
  type Export,
  type KeyValueCols,
  type Poi,
  type PoiDraft,
  type Report,
};
