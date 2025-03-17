"use client";

import { DataTable } from "@/app/(authenticated)/users/data-table";
import { TeamsProvider } from "@/app/(authenticated)/users/providers/teams";
import { RefreshProvider } from "@/app/(authenticated)/users/providers/refresh";

type ClientPageArgs = {
  graphqlServerUrl: string;
  accessToken: string;
};

export default function ClientPage({
  graphqlServerUrl,
  accessToken,
}: ClientPageArgs) {
  return (
    <TeamsProvider>
      <RefreshProvider>
        <DataTable
          graphqlServerUrl={graphqlServerUrl}
          accessToken={accessToken}
        />
      </RefreshProvider>
    </TeamsProvider>
  );
}
