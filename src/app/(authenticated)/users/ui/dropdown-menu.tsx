import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal, Pencil, Trash } from "lucide-react";
import DeleteAlertDialog from "@/app/(authenticated)/users/ui/delete-alert-dialog";
import React from "react";
import UserSheetForm from "@/app/(authenticated)/users/ui/forms/update";

export default function UserDropdownMenu({ ...props }) {
  const user = props.user;

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
          onClick={() => navigator.clipboard.writeText(user.cuid)}
        >
          <Copy />
          Copy user ID
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            setSheetFormOpen(true);
          }}
        >
          <Pencil />
          Update User
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setAlertDialogOpen(true)}>
          <Trash />
          Trash User
        </DropdownMenuItem>
      </DropdownMenuContent>

      <UserSheetForm
        open={sheetFormOpen}
        setOpen={setSheetFormOpen}
        user={user}
        setRefresh={props.setRefresh}
        apiClient={props.apiClient}
      />

      <DeleteAlertDialog
        open={alertDialogOpen}
        setAlertDialogOpen={setAlertDialogOpen}
        user={user}
        setRefresh={props.setRefresh}
        apiClient={props.apiClient}
      />
    </DropdownMenu>
  );
}
