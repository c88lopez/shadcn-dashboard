import { DataTable } from "@/app/(authenticated)/users/data-table";
import { auth } from "@/auth";

export default async function Users() {
  const session = await auth();

  return (
    <div className="container mx-auto py-10">
      <DataTable
        graphqlServerUrl={process.env.GRAPHQL_SERVER}
        accessToken={session?.user?.id}
      />
    </div>
  );
}
