"use client";

import { DataTable } from "@/app/(authenticated)/users/data-table";
import { RefreshProvider } from "@/providers/refresh";
import { UserGroupsProvider } from "@/providers/user-groups";
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
      <UserGroupsProvider>
        <RefreshProvider>
          <DataTable
            graphqlServerUrl={graphqlServerUrl}
            accessToken={accessToken}
          />
        </RefreshProvider>
      </UserGroupsProvider>
    </UsersProvider>
  );
}
