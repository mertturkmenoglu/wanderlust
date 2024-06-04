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
