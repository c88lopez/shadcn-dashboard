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
import { gqlCreateUser } from "@/lib/api/queries/users";
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
import { UserGroup, UserGroupCreateSchema } from "@vandelay-labs/schemas";
import ApiClient from "@/lib/api/client";
import { redirect } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MenuItem from "@/app/(authenticated)/user-groups/ui/forms/menu-item";
import { useSetRefreshContext } from "@/providers/refresh";
import { useUserGroupsContext } from "@/providers/user-groups";

type UserSheetFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  apiClient: ApiClient;
  userGroup?: UserGroup;
};

export default function UserGroupCreateSheetForm({
  ...props
}: UserSheetFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof UserGroupCreateSchema>>({
    resolver: zodResolver(UserGroupCreateSchema),
    defaultValues: {
      name: props?.userGroup?.name ?? "",
    },
    values: {
      name: props?.userGroup?.name ?? "",
    },
  });

  const [submitting, setSubmitting] = React.useState(false);

  const userGroups = useUserGroupsContext();
  const setRefresh = useSetRefreshContext();

  const selectedUsers = React.useRef<string[]>([]);

  function updateSelectedGroups(groupCuid: string, add: boolean) {
    if (add) {
      selectedUsers.current.push(groupCuid);
    } else {
      selectedUsers.current = selectedUsers.current.filter(
        (cuid) => cuid !== groupCuid,
      );
    }
  }

  async function onSubmit(values: z.infer<typeof UserGroupCreateSchema>) {
    setSubmitting(true);

    const name = values.name;

    const gql = gqlCreateUser;
    const variables: {
      createUserGroupData: {
        name: string;
        groups?: string[];
      };
    } = {
      createUserGroupData: {
        name,
      },
    };

    if (selectedUsers.current.length > 0) {
      variables.createUserGroupData.groups = selectedUsers.current;
    }

    try {
      props.apiClient
        .mutate({
          mutation: gql,
          variables,
        })
        .then(() => {
          setRefresh(true);

          toast.success(`User created successfully.`);

          props.setOpen(false);
          selectedUsers.current = [];
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
                <SheetTitle>Create user group</SheetTitle>
                <SheetDescription>Create a new user group.</SheetDescription>
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
                  {userGroups.length === 0 ? (
                    <MenuItem
                      updateSelectedGroups={() => {}}
                      userGroup={{ cuid: "", name: "No groups available" }}
                      disabled={true}
                      selectedUsers={selectedUsers}
                    />
                  ) : (
                    userGroups.map((userGroup) => (
                      <MenuItem
                        key={userGroup.cuid}
                        updateSelectedGroups={updateSelectedGroups}
                        userGroup={userGroup}
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
                  Create
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}
