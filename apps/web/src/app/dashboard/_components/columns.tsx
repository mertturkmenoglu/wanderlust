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

export const eventCols: ColumnDef<Location>[] = [
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
