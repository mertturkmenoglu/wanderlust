import { ColumnDef } from '@tanstack/react-table';

export type Poi = {
  id: string;
  name: string;
  category: string;
  city: string;
  state: string;
  country: string;
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
