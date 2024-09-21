import { ColumnDef } from '@tanstack/react-table';

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
