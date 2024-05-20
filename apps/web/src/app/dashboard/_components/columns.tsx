import { ColumnDef } from "@tanstack/react-table";

export type Location = {
  id: string;
  name: string;
  categoryId: number;
};

export type Event = {
  id: string;
  name: string;
  organizerId: string;
};

export type Address = {
  id: string;
  country: string;
  city: string;
  lat: number;
  long: number;
};

export const locationsCols: ColumnDef<Location>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "categoryId",
    header: "Category",
  },
];

export const eventCols: ColumnDef<Event>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "organizerId",
    header: "Organizer",
  },
];

export const addressCols: ColumnDef<Location>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "lat",
    header: "Latitude",
  },
  {
    accessorKey: "long",
    header: "Longitude",
  },
];
