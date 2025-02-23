import React from "react";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { gqlCreateUser, getGraphQLClient, gqlUpdateUser } from "@/lib/graphql";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/app/users/columns";

type ComponentProperties = {
  sheetFormOpen: boolean;
  setSheetFormOpen: React.Dispatch<React.SetStateAction<boolean>>;

  user?: User;
};

export default function UserSheetForm({ ...props }: ComponentProperties) {
  const client = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const username = formData.get("username");
      const email = formData.get("email");

      let gql = gqlCreateUser;
      let variables: any = {
        createUserData: {
          username,
          email,
        },
      };

      if (props?.user) {
        gql = gqlUpdateUser;
        variables = {
          cuid: props.user.cuid,
          updateUserData: {
            username,
            email,
          },
        };
      }

      const { data } = await getGraphQLClient().mutate({
        mutation: gql,
        variables,
      });

      await client.invalidateQueries({ queryKey: ["users"] });

      toast.success(
        `User ${props?.user ? "updated" : "created"} successfully.`,
      );
      props.setSheetFormOpen(false);

      return data;
    },
  });

  return (
    <>
      <Sheet open={props.sheetFormOpen} onOpenChange={props.setSheetFormOpen}>
        <SheetContent>
          <form
            action={(formData) => {
              mutation.mutate(formData);
            }}
          >
            <SheetHeader>
              <SheetTitle>Create user</SheetTitle>
              <SheetDescription>Create a new user.</SheetDescription>
            </SheetHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  required={true}
                  id="username"
                  name="username"
                  defaultValue={props?.user?.username}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  required={true}
                  id="email"
                  name="email"
                  defaultValue={props?.user?.email}
                  className="col-span-3"
                />
              </div>
            </div>

            <SheetFooter>
              <Button type="submit">{props?.user ? "Update" : "Create"}</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
