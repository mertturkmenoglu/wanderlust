import { ColumnDef } from "@tanstack/react-table";

export type Poi = {
  id: string;
  name: string;
  addressId: number;
  categoryId: number;
};

export const poisCols: ColumnDef<Poi>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "addressId",
    header: "Address ID",
  },
  {
    accessorKey: "categoryId",
    header: "Category ID",
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
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "stateName",
    header: "State",
  },
  {
    accessorKey: "countryName",
    header: "Country",
  },
];
