import { type ColumnDef } from '@tanstack/react-table';

export type KeyValueCols = {
  k: string;
  v: string;
};

export const keyValueCols: ColumnDef<KeyValueCols>[] = [
  {
    accessorKey: 'k',
    header: 'Key',
  },
  {
    accessorKey: 'v',
    header: 'Value',
  },
];

export type Poi = {
  id: string;
  name: string;
  addressId: number;
  categoryId: number;
};

export const poisCols: ColumnDef<Poi>[] = [
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

export type Report = {
  id: string;
  resourceId: string;
  resourceType: string;
  reporterId: string | null;
  description: string | null;
  reason: number;
  resolved: boolean;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export const reportsCols: ColumnDef<Report>[] = [
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

export type PoiDraft = {
  id: string;
  name: string;
  v: number;
};

export const poisDraftsCols: ColumnDef<PoiDraft>[] = [
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

export type City = {
  id: number;
  name: string;
  stateName: string;
  stateCode: string;
  countryName: string;
  countryCode: string;
};

export const citiesCols: ColumnDef<City>[] = [
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

export type Collection = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export const collectionsCols: ColumnDef<Collection>[] = [
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
