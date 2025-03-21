import ApiClient from "@/lib/api/client";
import {
  User,
  UserCreateSchema,
  UserGroup,
  UserUpdateSchema,
} from "@vandelay-labs/schemas";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserGroupsContext } from "@/providers/user-groups";
import { useSetRefreshContext } from "@/providers/refresh";
import { toast } from "sonner";
import { ApolloError } from "@apollo/client";
import { redirect } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import MenuItem from "@/components/menu-item";
import { gqlCreateUser, gqlUpdateUser } from "@/lib/api/queries/users";

type UserSheetFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  apiClient: ApiClient;
  user?: User;
};

export default function UserSheetForm({ ...props }: UserSheetFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);

  const form = useForm<
    z.infer<typeof UserCreateSchema | typeof UserUpdateSchema>
  >({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      username: props.user?.username ?? "",
      email: props.user?.email ?? "",
      password: "",
    },
  });

  const [submitting, setSubmitting] = React.useState(false);

  const userGroups = useUserGroupsContext();
  const setRefresh = useSetRefreshContext();

  const selectedGroups = React.useRef<string[]>(
    (props.user?.groups ?? []).map((group: UserGroup) => group.cuid),
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

  async function onSubmit(
    values: z.infer<typeof UserCreateSchema | typeof UserUpdateSchema>,
  ) {
    setSubmitting(true);

    const email = values.email;
    const username = values.username;
    const password = values.password;

    const gql = props.user ? gqlUpdateUser : gqlCreateUser;
    let variables:
      | {
          createUserData: {
            email: string;
            username: string;
            password: string;
            groups?: string[];
          };
        }
      | {
          cuid: string;
          updateUserData: {
            email: string;
            username: string;
            password?: string;
            groups?: string[];
          };
        };

    if (props.user) {
      variables = {
        cuid: props.user.cuid,
        updateUserData: {
          username,
          email,
          password,
          groups: selectedGroups.current,
        },
      };
    } else {
      variables = {
        createUserData: {
          username,
          email,
          password: password ?? "",
          groups: selectedGroups.current,
        },
      };
    }

    try {
      await props.apiClient.mutate({
        mutation: gql,
        variables,
      });

      setRefresh(true);
      toast.success(`User ${props.user ? "updated" : "created"} successfully.`);

      props.setOpen(false);

      selectedGroups.current = [];
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
              <SheetTitle>{props.user ? "Update" : "Create"} user</SheetTitle>
              <SheetDescription>
                {props.user ? "Update selected" : "Create"} user
              </SheetDescription>
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
                      entity={{ cuid: group.cuid, displayName: group.name }}
                      selectedList={selectedGroups}
                      updateSelectedList={updateSelectedGroups}
                    />
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <SheetFooter>
              <FormMessage className="">{serverError}</FormMessage>
              <div className="min-w-10"></div>
              <Button type="submit" disabled={submitting}>
                {props.user ? "Update" : "Create"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
