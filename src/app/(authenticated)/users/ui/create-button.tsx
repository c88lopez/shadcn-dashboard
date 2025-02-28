import React from "react";
import { Button } from "@/components/ui/button";
import UserSheetForm from "@/app/(authenticated)/users/ui/form";
import { Plus } from "lucide-react";

export default function CreateButton() {
  const [sheetFormOpen, setSheetFormOpen] = React.useState(false);

  return (
    <>
      <Button variant="default" onClick={() => setSheetFormOpen(true)}>
        Create
        <Plus />
      </Button>

      <UserSheetForm open={sheetFormOpen} setOpen={setSheetFormOpen} />
    </>
  );
}
