import { DataTable } from "@/app/users/data-table";
import { columns, User } from "@/app/users/columns";

async function getData(): Promise<User[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      username: "linguini",
      email: "m@example.com",
    },
  ];
}

export default async function Users() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
