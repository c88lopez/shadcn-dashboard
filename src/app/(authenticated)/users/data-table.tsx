"use client";

import React, { Dispatch, SetStateAction, useEffect } from "react";

import {
  ColumnDef,
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getGraphQLClient, gqlGetUsers, gqlDeleteUser } from "@/lib/graphql";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Skeleton,
  ButtonSkeleton,
  InputSkeleton,
} from "@/components/ui/skeleton";
import { User } from "@/app/(authenticated)/users/columns";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import UserSheetForm from "@/app/(authenticated)/users/ui/form";

type ColumnFunction<TData, TValue> = ({
  setSheetFormOpen,
  setUpdateUserAction,
  setDeleteUserAction,
}: {
  setSheetFormOpen: Dispatch<SetStateAction<boolean>>;
  setUpdateUserAction: Dispatch<SetStateAction<User | undefined>>;
  setDeleteUserAction: Dispatch<SetStateAction<User | undefined>>;
}) => ColumnDef<TData, TValue>[];

interface DataTableProps<TData, TValue> {
  columns: ColumnFunction<TData, TValue>;
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const client = useQueryClient();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [rowSelection, setRowSelection] = React.useState({});

  const { isPending, data } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await getGraphQLClient().query({
        query: gqlGetUsers,
      });

      return data.Users;
    },
  });

  const [sheetFormOpen, setSheetFormOpen] = React.useState(false);

  const [updateUser, setUpdateUserAction] = React.useState<User | undefined>();

  const [deleteUser, setDeleteUserAction] = React.useState<User | undefined>();
  const [confirmedDeleteUser, setConfirmedDeleteUser] =
    React.useState<boolean>(false);

  const table = useReactTable({
    data: data ?? [],
    columns: columns({
      setSheetFormOpen,
      setUpdateUserAction,
      setDeleteUserAction,
    }),
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

  // Delete effect hook
  useEffect(() => {
    if (confirmedDeleteUser && deleteUser) {
      getGraphQLClient()
        .mutate({
          mutation: gqlDeleteUser,
          variables: {
            cuid: deleteUser.cuid,
          },
        })
        .then(() => {
          return client.invalidateQueries({ queryKey: ["users"] }).then(() => {
            toast.success("User deleted successfully.", {
              description: `User ${deleteUser.email} has been deleted.`,
            });
            setDeleteUserAction(undefined);
            setConfirmedDeleteUser(false);
          });
        });
    }
  }, [confirmedDeleteUser]);

  if (isPending) {
    return (
      <div>
        <div className="flex flex-grow w-full items-center py-4">
          <InputSkeleton className="flex w-full h-10 max-w-sm" />

          <div className="flex w-full"></div>

          <Separator orientation="vertical" className="mx-4 h-6" />

          <ButtonSkeleton className="flex h-10 w-[156px] gap-2" />
        </div>

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
              {Array(5)
                .fill({ id: "skeleton" })
                .map((row, index) => (
                  <TableRow key={row.id + index}>
                    {Array(5)
                      .fill({ id: "skeleton" })
                      .map((cell, index) => (
                        <TableCell key={cell.id + index}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UserSheetForm
        user={updateUser}
        sheetFormOpen={sheetFormOpen}
        setSheetFormOpen={setSheetFormOpen}
      />

      {/* Filter row*/}
      <div className="flex w-full items-center py-4">
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

        <Button variant="default" onClick={() => setSheetFormOpen(true)}>
          Create
          <Plus />
        </Button>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      {/* Delete confirmation alert dialog */}
      <AlertDialog open={!!deleteUser}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteUserAction(undefined)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setConfirmedDeleteUser(true)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
