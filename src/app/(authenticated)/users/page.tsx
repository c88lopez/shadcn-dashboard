import { DataTable } from "@/app/(authenticated)/users/data-table";
import { auth } from "@/auth";

export default async function Users() {
  const session = await auth();

  console.log(session);

  return (
    <div className="container mx-auto py-10">
      <DataTable accessToken={session?.user?.id} />
    </div>
  );
}
