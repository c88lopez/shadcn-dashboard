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
import React, { useEffect } from "react";
import { getGraphQLClient, gqlDeleteUser } from "@/lib/graphql";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function DeleteAlertDialog({ ...props }) {
  const client = useQueryClient();

  const [confirmedDeleteUser, setConfirmedDeleteUser] =
    React.useState<boolean>(false);

  useEffect(() => {
    if (confirmedDeleteUser && props.user) {
      getGraphQLClient()
        .mutate({
          mutation: gqlDeleteUser,
          variables: {
            cuid: props.user.cuid,
          },
        })
        .then(() => {
          return client.invalidateQueries({ queryKey: ["users"] }).then(() => {
            toast.success("User deleted successfully.", {
              description: `User ${props.user.email} has been deleted.`,
            });

            props.setAlertDialogOpen(false);
            setConfirmedDeleteUser(false);
          });
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
          <AlertDialogCancel
            onClick={() => props.setAlertDialogOpen(undefined)}
          >
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
