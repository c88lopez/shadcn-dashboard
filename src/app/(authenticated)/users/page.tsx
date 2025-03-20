"use server";

import { auth } from "@/auth";
import ClientPage from "@/app/(authenticated)/users/client-page";

export default async function Users() {
  const session = await auth();

  const graphqlServerUrl = process.env.GRAPHQL_SERVER ?? "";
  const accessToken = session?.user?.id ?? "";

  return (
    <div className="container mx-auto py-10 gap-4 p-4 pt-0">
      <ClientPage
        graphqlServerUrl={graphqlServerUrl}
        accessToken={accessToken}
      />
    </div>
  );
}
