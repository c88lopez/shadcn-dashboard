"use client";

import React, { useEffect } from "react";

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import CreateButton from "@/app/(authenticated)/users/ui/create-button";
import DataTableSkeleton from "@/app/(authenticated)/users/ui/data-table-skeleton";
import Pagination from "@/app/(authenticated)/users/ui/pagination";
import { columns } from "@/app/(authenticated)/users/columns";
import { gqlGetUsers } from "@/lib/api/queries/users";
import ApiClient from "@/lib/api/client";
import { redirect } from "next/navigation";

export function DataTable({ ...props }) {
  const apiClient = new ApiClient(props.accessToken);

  const [data, setData] = React.useState([]);
  const [isPending, setIsPending] = React.useState(true);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [rowSelection, setRowSelection] = React.useState({});

  useEffect(() => {
    apiClient
      .query({
        query: gqlGetUsers,
      })
      .then((result) => {
        const { data } = result;

        setData(data.Users);
        setIsPending(false);
      })
      .catch((error) => {
        if (error.message === "Unauthorized") {
          // Redirect to login page.
          redirect("/login");
        }
      });
  }, []);

  const table = useReactTable({
    data,
    columns: columns(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  if (isPending) {
    return <DataTableSkeleton table={table} />;
  }

  return (
    <div>
      <div className="flex w-full items-center py-4">
        {/* Filter field*/}
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="flex w-full"></div>

        <Separator orientation="vertical" className="mx-4 h-6" />

        <CreateButton />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination table={table} />
    </div>
  );
}
