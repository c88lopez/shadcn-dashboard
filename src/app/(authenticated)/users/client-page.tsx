"use client";

import { DataTable } from "@/app/(authenticated)/users/data-table";
import { RefreshProvider } from "@/providers/refresh";
import { UserGroupsProvider } from "@/providers/user-groups";

type ClientPageArgs = {
  graphqlServerUrl: string;
  accessToken: string;
};

export default function ClientPage({
  graphqlServerUrl,
  accessToken,
}: ClientPageArgs) {
  return (
    <UserGroupsProvider>
      <RefreshProvider>
        <DataTable
          graphqlServerUrl={graphqlServerUrl}
          accessToken={accessToken}
        />
      </RefreshProvider>
    </UserGroupsProvider>
  );
}
