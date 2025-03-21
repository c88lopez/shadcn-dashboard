import React from "react";

import { Button } from "@/components/ui/button";
import UserSheetForm from "@/app/(authenticated)/user-groups/ui/form";
import { Plus } from "lucide-react";
import ApiClient from "@/lib/api/client";

type CreateButtonProps = {
  apiClient: ApiClient;
};

export default function CreateButton({ ...props }: CreateButtonProps) {
  const [sheetFormOpen, setSheetFormOpen] = React.useState(false);

  return (
    <div>
      <Button variant="outline" onClick={() => setSheetFormOpen(true)}>
        <Plus />
        Create
      </Button>

      <UserSheetForm
        apiClient={props.apiClient}
        open={sheetFormOpen}
        setOpen={setSheetFormOpen}
      />
    </div>
  );
}
