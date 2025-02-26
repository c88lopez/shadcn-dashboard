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
import { gqlCreateUser, getGraphQLClient, gqlUpdateUser } from "@/lib/graphql";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/app/users/columns";
import { ApolloError } from "@apollo/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserSchema } from "schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type ComponentProperties = {
  sheetFormOpen: boolean;
  setSheetFormOpen: React.Dispatch<React.SetStateAction<boolean>>;

  user?: User;
};

type FormValues = {
  username: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
};

export default function UserSheetForm({ ...props }: ComponentProperties) {
  const client = useQueryClient();

  const [serverError, setServerError] = React.useState<string | null>(null);

  const formSchema = UserSchema.omit({ cuid: true });

  console.log({ props });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: props?.user?.username ?? "",
      email: props?.user?.email ?? "",
    },
    values: {
      username: props?.user?.username ?? "",
      email: props?.user?.email ?? "",
    },
  });

  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    const username = values.username;
    const email = values.email;

    let gql = gqlCreateUser;
    let variables: {
      createUserData?: {
        username: FormDataEntryValue | null;
        email: FormDataEntryValue | null;
      };
      cuid?: string;
      updateUserData?: FormValues;
    } = {
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

    try {
      await getGraphQLClient().mutate({
        mutation: gql,
        variables,
      });

      await client.invalidateQueries({ queryKey: ["users"] });

      toast.success(
        `User ${props?.user ? "updated" : "created"} successfully.`,
      );

      props.setSheetFormOpen(false);
    } catch (error) {
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
      <Sheet open={props.sheetFormOpen} onOpenChange={props.setSheetFormOpen}>
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
                      <Input placeholder="wtf" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
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
                    <FormDescription>This is your Email.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter>
                <FormMessage className="">{serverError}</FormMessage>
                <div className="min-w-10"></div>
                <Button type="submit" disabled={submitting}>
                  {props?.user ? "Update" : "Create"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}
