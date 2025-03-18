import React from "react";
import { toast } from "sonner";

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
import { gqlUpdateUser } from "@/lib/api/queries/users";
import { ApolloError } from "@apollo/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User, UserGroup, UserGroupUpdateSchema } from "@vandelay-labs/schemas";
import ApiClient from "@/lib/api/client";
import { redirect } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MenuItem from "@/app/(authenticated)/user-groups/ui/forms/menu-item";
import { useSetRefreshContext } from "@/providers/refresh";
import { useUsersContext } from "@/providers/users";

type UserSheetFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  apiClient: ApiClient;
  userGroup: UserGroup;
};

export default function UserGroupUpdateSheetForm({
  ...props
}: UserSheetFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof UserGroupUpdateSchema>>({
    resolver: zodResolver(UserGroupUpdateSchema),
    defaultValues: {
      name: props.userGroup.name,
    },
    values: {
      name: props.userGroup.name,
    },
  });

  const [submitting, setSubmitting] = React.useState(false);

  const users = useUsersContext();

  const setRefresh = useSetRefreshContext();

  const selectedUsers = React.useRef<string[]>(
    props.userGroup.users.map((user: User) => user.cuid),
  );

  function updateSelectedUsers(userCuid: string, add: boolean) {
    if (add) {
      selectedUsers.current.push(userCuid);
    } else {
      selectedUsers.current = selectedUsers.current.filter(
        (cuid) => cuid !== userCuid,
      );
    }
  }

  async function onSubmit(values: z.infer<typeof UserGroupUpdateSchema>) {
    setSubmitting(true);

    const name = values.name;

    const gql = gqlUpdateUser;
    const variables = {
      cuid: props.userGroup.cuid,
      updateUserData: {
        name,
        users: selectedUsers.current,
      },
    };

    try {
      props.apiClient
        .mutate({
          mutation: gql,
          variables,
        })
        .then(() => {
          setRefresh(true);

          toast.success(`User updated successfully.`);

          props.setOpen(false);
          form.reset();
        });
    } catch (error) {
      if (error instanceof ApolloError && error.message === "Unauthorized") {
        redirect("/login");
      }

      if (error instanceof ApolloError) {
        setServerError(error.message);

        return {
          errors: {
            email: error.message,
          },
        };
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Sheet open={props.open} onOpenChange={props.setOpen}>
        <SheetContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <SheetHeader>
                <SheetTitle>Update user group</SheetTitle>
                <SheetDescription>Update selected user group.</SheetDescription>
              </SheetHeader>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Users</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {users.length === 0 ? (
                    <DropdownMenuCheckboxItem disabled={true}>
                      No users available
                    </DropdownMenuCheckboxItem>
                  ) : (
                    users.map((user) => (
                      <MenuItem
                        key={user.cuid}
                        updateSelectedUsers={updateSelectedUsers}
                        user={user}
                        selectedUsers={selectedUsers}
                      />
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <SheetFooter>
                <FormMessage className="">{serverError}</FormMessage>
                <div className="min-w-10"></div>
                <Button type="submit" disabled={submitting}>
                  Update
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}
