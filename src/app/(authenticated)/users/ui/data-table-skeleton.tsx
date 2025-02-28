import {
  ButtonSkeleton,
  InputSkeleton,
  Skeleton,
} from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import React from "react";

export default function DataTableSkeleton({ ...props }) {
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
            {props.table.getHeaderGroups().map((headerGroup) => (
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
          0 of 0 row(s) selected.
        </div>

        <Button variant="outline" size="sm">
          Previous
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  );
}
