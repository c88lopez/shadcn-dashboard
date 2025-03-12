import { DataTable } from "@/app/(authenticated)/users/data-table";
import { auth } from "@/auth";

export default async function Users() {
  const session = await auth();
  const graphqlServerUrl = process.env.GRAPHQL_SERVER;

  return (
    <div className="container mx-auto py-10">
      <DataTable
        graphqlServerUrl={graphqlServerUrl}
        accessToken={session?.user?.id}
      />
    </div>
  );
}
