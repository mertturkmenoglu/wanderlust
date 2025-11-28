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

type Place = {
  id: string;
  name: string;
  addressId: number;
  categoryId: number;
};

const placesCols: ColumnDef<Place>[] = [
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

type PlaceDraft = {
  id: string;
  name: string;
  v: number;
};

const placeDraftCols: ColumnDef<PlaceDraft>[] = [
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
  keyValueCols,
  placesCols,
  placeDraftCols,
  reportsCols,
  type City,
  type Collection,
  type KeyValueCols,
  type Place,
  type PlaceDraft,
  type Report,
};
