"use client";

import { DataTable } from "@/app/(authenticated)/users/data-table";
import { RefreshProvider } from "@/providers/refresh";
import { UsersProvider } from "@/providers/users";

type ClientPageArgs = {
  graphqlServerUrl: string;
  accessToken: string;
};

export default function ClientPage({
  graphqlServerUrl,
  accessToken,
}: ClientPageArgs) {
  return (
    <UsersProvider>
      <RefreshProvider>
        <DataTable
          graphqlServerUrl={graphqlServerUrl}
          accessToken={accessToken}
        />
      </RefreshProvider>
    </UsersProvider>
  );
}
