import { type ColumnDef } from '@tanstack/react-table';

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

export type City = {
  id: number;
  name: string;
  stateName: string;
  countryName: string;
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
    accessorKey: 'countryName',
    header: 'Country',
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
