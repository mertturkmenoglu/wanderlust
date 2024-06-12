import { ColumnDef } from '@tanstack/react-table';

export type Location = {
  id: string;
  name: string;
  category: string;
  city: string;
  state: string;
  country: string;
};

export type Event = {
  id: string;
  name: string;
  organizerId: string;
};

export type Report = {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: string;
  reason: string;
  status: string;
  resolvedBy: string | null;
};

export const locationsCols: ColumnDef<Location>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'city',
    header: 'City',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
  {
    accessorKey: 'country',
    header: 'Country',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
];

export const eventCols: ColumnDef<Event>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'organizerId',
    header: 'Organizer',
  },
];

export const reportCols: ColumnDef<Report>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'reporterId',
    header: 'Reporter',
  },
  {
    accessorKey: 'targetId',
    header: 'Target',
  },
  {
    accessorKey: 'targetType',
    header: 'Type',
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'resolvedBy',
    header: 'Resolved By',
  },
];
