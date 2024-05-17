"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Point = {
  id: string;
  name: string;
  categoryId: number;
};

export type Event = {
  id: string;
  name: string;
  organizerId: string;
};

export const pointCols: ColumnDef<Point>[] = [
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

export const eventCols: ColumnDef<Point>[] = [
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
