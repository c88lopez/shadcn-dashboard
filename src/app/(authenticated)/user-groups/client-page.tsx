"use client";

import { DataTable } from "@/app/(authenticated)/user-groups/data-table";

import { RefreshProvider } from "@/providers/refresh";
import { UsersProvider } from "@/providers/users";
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
