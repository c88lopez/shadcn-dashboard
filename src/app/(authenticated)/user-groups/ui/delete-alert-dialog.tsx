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
import { toast } from "sonner";
import ApiClient from "@/lib/api/client";
import { useSetRefreshContext } from "@/providers/refresh";
import { UserGroup } from "@vandelay-labs/schemas";
import { gqlDeleteUserGroup } from "@/lib/api/queries/user-groups";

type DeleteAlertDialogProps = {
  userGroup: UserGroup;
  apiClient: ApiClient;
  open: boolean;
  setAlertDialogOpen: Dispatch<SetStateAction<boolean>>;
};

export default function DeleteAlertDialog({
  ...props
}: DeleteAlertDialogProps) {
  const setRefresh = useSetRefreshContext();

  const [confirmedDelete, setConfirmedDelete] = React.useState<boolean>(false);

  useEffect(() => {
    if (confirmedDelete && props.userGroup) {
      props.apiClient
        .mutate({
          mutation: gqlDeleteUserGroup,
          variables: {
            cuid: props.userGroup.cuid,
          },
        })
        .then(() => {
          setRefresh(true);

          toast.success("User group deleted successfully.", {
            description: `User group ${props.userGroup.name} has been deleted.`,
          });

          props.setAlertDialogOpen(false);
          setConfirmedDelete(false);
        });
    }
  }, [confirmedDelete]);

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
          <AlertDialogAction onClick={() => setConfirmedDelete(true)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
