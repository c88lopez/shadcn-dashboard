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
import { UserCreateSchema } from "@vandelay-labs/schemas";
import ApiClient from "@/lib/api/client";
import { redirect } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MenuItem from "@/app/(authenticated)/users/ui/forms/menu-item";
import { useSetRefreshContext } from "@/app/(authenticated)/users/providers/refresh";
import { useUserGroupsContext } from "@/app/(authenticated)/users/providers/user-groups";

type UserSheetFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  apiClient: ApiClient;
  user?: {
    cuid: string;
    username: string;
    email: string;
  };
};

export default function UserCreateSheetForm({ ...props }: UserSheetFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof UserCreateSchema>>({
    resolver: zodResolver(UserCreateSchema),
    defaultValues: {
      username: props?.user?.username ?? "",
      email: props?.user?.email ?? "",
      password: "",
    },
    values: {
      username: props?.user?.username ?? "",
      email: props?.user?.email ?? "",
      password: "",
    },
  });

  const [submitting, setSubmitting] = React.useState(false);

  const teams = useUserGroupsContext();
  const setRefresh = useSetRefreshContext();

  const selectedTeams = React.useRef<string[]>([]);

  function updateSelectedTeams(teamCuid: string, add: boolean) {
    if (add) {
      selectedTeams.current.push(teamCuid);
    } else {
      selectedTeams.current = selectedTeams.current.filter(
        (cuid) => cuid !== teamCuid,
      );
    }
  }

  async function onSubmit(values: z.infer<typeof UserCreateSchema>) {
    setSubmitting(true);

    const email = values.email;
    const username = values.username;
    const password = values.password;

    const gql = gqlCreateUser;
    const variables: {
      createUserData: {
        username: string;
        email: string;
        password: string;
        teams?: string[];
      };
    } = {
      createUserData: {
        username,
        email,
        password,
      },
    };

    if (selectedTeams.current.length > 0) {
      variables.createUserData.teams = selectedTeams.current;
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
          selectedTeams.current = [];
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
                <SheetTitle>Create user</SheetTitle>
                <SheetDescription>Create a new user.</SheetDescription>
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
                  <Button variant="outline">Teams</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {teams.length === 0 ? (
                    <MenuItem
                      updateSelectedTeams={updateSelectedTeams}
                      team={{ cuid: "", name: "No teams available" }}
                      disabled={true}
                      selectedTeams={selectedTeams}
                    />
                  ) : (
                    teams.map((team) => (
                      <MenuItem
                        key={team.cuid}
                        updateSelectedTeams={updateSelectedTeams}
                        team={team}
                        selectedTeams={selectedTeams}
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
