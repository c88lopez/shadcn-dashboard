import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { gqlDeleteUser } from "@/lib/api/queries/users";
import { toast } from "sonner";
import ApiClient from "@/lib/api/client";
import { useSetRefreshContext } from "@/providers/refresh";
import { User } from "@vandelay-labs/schemas";

type DeleteAlertDialogProps = {
  user: User;
  apiClient: ApiClient;
  open: boolean;
  setAlertDialogOpen: Dispatch<SetStateAction<boolean>>;
};

export default function DeleteAlertDialog({
  ...props
}: DeleteAlertDialogProps) {
  const setRefresh = useSetRefreshContext();

  const [confirmedDeleteUser, setConfirmedDeleteUser] =
    React.useState<boolean>(false);

  useEffect(() => {
    if (confirmedDeleteUser && props.user) {
      props.apiClient
        .mutate({
          mutation: gqlDeleteUser,
          variables: {
            cuid: props.user.cuid,
          },
        })
        .then(() => {
          setRefresh(true);

          toast.success("User deleted successfully.", {
            description: `User ${props.user.email} has been deleted.`,
          });

          props.setAlertDialogOpen(false);
          setConfirmedDeleteUser(false);
        });
    }
  }, [confirmedDeleteUser]);

  return (
    <AlertDialog open={props.open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove your data
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => props.setAlertDialogOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => setConfirmedDeleteUser(true)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
