import React from "react";
import { Copy, MoreHorizontal, Pencil, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import UserGroupSheetForm from "@/app/(authenticated)/user-groups/ui/form";
import DeleteAlertDialog from "@/app/(authenticated)/user-groups/ui/delete-alert-dialog";
import ApiClient from "@/lib/api/client";
import { UserGroup } from "@vandelay-labs/schemas";

type UserDropdownMenuProps = {
  apiClient: ApiClient;
  userGroup: UserGroup;
};

export default function UserDropdownMenu({ ...props }: UserDropdownMenuProps) {
  const userGroup = props.userGroup;

  const [sheetFormOpen, setSheetFormOpen] = React.useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = React.useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(userGroup.cuid)}
        >
          <Copy />
          Copy user group ID
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            setSheetFormOpen(true);
          }}
        >
          <Pencil />
          Update User Group
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setAlertDialogOpen(true)}>
          <Trash />
          Trash User Group
        </DropdownMenuItem>
      </DropdownMenuContent>

      <UserGroupSheetForm
        open={sheetFormOpen}
        setOpen={setSheetFormOpen}
        userGroup={userGroup}
        apiClient={props.apiClient}
      />

      <DeleteAlertDialog
        open={alertDialogOpen}
        setAlertDialogOpen={setAlertDialogOpen}
        userGroup={userGroup}
        apiClient={props.apiClient}
      />
    </DropdownMenu>
  );
}
