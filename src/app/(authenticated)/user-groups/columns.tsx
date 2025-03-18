"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import UserDropdownMenu from "@/app/(authenticated)/user-groups/ui/dropdown-menu";
import { UserGroup } from "@vandelay-labs/schemas";

export const columns = (): ColumnDef<UserGroup>[] => [
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
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "users",
    header: "Users",
    cell: ({ row }) => {
      const userGroup = row.original;

      return (userGroup?.users ?? []).length;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ table, row }) => {
      const userGroup = row.original;

      if (table.options.meta?.apiClient === undefined) {
        throw new Error("apiClient is required");
      }

      const apiClient = table.options.meta?.apiClient;

      return <UserDropdownMenu userGroup={userGroup} apiClient={apiClient} />;
    },
  },
];
