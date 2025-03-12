import React, { Dispatch } from "react";

import { Button } from "@/components/ui/button";
import UserSheetForm from "@/app/(authenticated)/users/ui/forms/create";
import { Plus } from "lucide-react";
import ApiClient from "@/lib/api/client";

type CreateButtonProps = {
  apiClient: ApiClient;
  setRefresh: Dispatch<boolean>;
  teams: { cuid: string; name: string }[];
};

export default function CreateButton({ ...props }: CreateButtonProps) {
  const [sheetFormOpen, setSheetFormOpen] = React.useState(false);

  return (
    <div>
      <Button variant="default" onClick={() => setSheetFormOpen(true)}>
        Create
        <Plus />
      </Button>

      <UserSheetForm
        apiClient={props.apiClient}
        setRefresh={props.setRefresh}
        open={sheetFormOpen}
        setOpen={setSheetFormOpen}
        teams={props.teams}
      />
    </div>
  );
}
