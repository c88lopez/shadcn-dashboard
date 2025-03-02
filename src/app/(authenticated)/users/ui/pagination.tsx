import { Button } from "@/components/ui/button";
import React from "react";

export default function Pagination({ ...props }) {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {props.table.getFilteredSelectedRowModel().rows.length} of{" "}
        {props.table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => props.table.previousPage()}
        disabled={!props.table.getCanPreviousPage()}
      >
        Previous
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => props.table.nextPage()}
        disabled={!props.table.getCanNextPage()}
      >
        Next
      </Button>
    </div>
  );
}
