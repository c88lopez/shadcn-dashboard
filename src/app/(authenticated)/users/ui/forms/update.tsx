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
import { User, UserGroup, UserUpdateSchema } from "@vandelay-labs/schemas";
import ApiClient from "@/lib/api/client";
import { redirect } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MenuItem from "@/app/(authenticated)/users/ui/forms/menu-item";
import { useSetRefreshContext } from "@/providers/refresh";
import { useUserGroupsContext } from "@/providers/user-groups";

type UserSheetFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  apiClient: ApiClient;
  user: User;
};

export default function UserUpdateSheetForm({ ...props }: UserSheetFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof UserUpdateSchema>>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      username: props.user.username,
      email: props.user.email,
      password: "",
    },
  });

  const [submitting, setSubmitting] = React.useState(false);

  const userGroups = useUserGroupsContext();
  const setRefresh = useSetRefreshContext();

  const selectedGroups = React.useRef<string[]>(
    props.user.groups.map((group: UserGroup) => group.cuid),
  );

  function updateSelectedGroups(groupCuid: string, add: boolean) {
    if (add) {
      selectedGroups.current.push(groupCuid);
    } else {
      selectedGroups.current = selectedGroups.current.filter(
        (cuid) => cuid !== groupCuid,
      );
    }
  }

  async function onSubmit(values: z.infer<typeof UserUpdateSchema>) {
    setSubmitting(true);

    const email = values.email;
    const username = values.username;
    const password = values.password;

    const gql = gqlUpdateUser;
    const variables: {
      cuid: string;
      updateUserData: {
        email: string;
        username: string;
        password?: string;
        groups?: string[];
      };
    } = {
      cuid: props.user.cuid,
      updateUserData: {
        username,
        email,
        password,
        groups: selectedGroups.current,
      },
    };

    try {
      await props.apiClient.mutate({
        mutation: gql,
        variables,
      });

      setRefresh(true);

      toast.success(`User updated successfully.`);

      props.setOpen(false);
      form.reset();
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
    <Sheet open={props.open} onOpenChange={props.setOpen}>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <SheetHeader>
              <SheetTitle>Update user</SheetTitle>
              <SheetDescription>Update selected user.</SheetDescription>
            </SheetHeader>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Groups</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {userGroups.length === 0 ? (
                  <DropdownMenuCheckboxItem disabled={true}>
                    No groups available
                  </DropdownMenuCheckboxItem>
                ) : (
                  userGroups.map((group) => (
                    <MenuItem
                      key={group.cuid}
                      updateSelectedGroups={updateSelectedGroups}
                      group={group}
                      selectedGroups={selectedGroups}
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
  );
}
