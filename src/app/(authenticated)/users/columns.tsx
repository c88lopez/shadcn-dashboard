"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import UserDropdownMenu from "@/app/(authenticated)/users/ui/dropdown-menu";
import { User } from "@vandelay-labs/schemas";

export const columns = (): ColumnDef<User>[] => [
  {
    id: "select",
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "cuid",
    header: "Id",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "groups",
    header: "Groups",
    cell: ({ row }) => {
      const user = row.original;

      return (user?.groups ?? []).length;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ table, row }) => {
      const user = row.original;

      return (
        <UserDropdownMenu
          user={user}
          apiClient={table.options.meta?.apiClient ?? {}}
        />
      );
    },
  },
];
