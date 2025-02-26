"use client";

import { DataTable } from "@/app/(authenticated)/users/data-table";
import { columns } from "@/app/(authenticated)/users/columns";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Users() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={[]} />
      </div>
    </QueryClientProvider>
  );
}
